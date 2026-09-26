# Dynamic 365 Client Scripting Toolkit

> A curated collection of reusable client-side patterns for **Dynamics 365 / Power Apps model-driven apps** — form scripting, lookup filtering, field manipulation, and Dataverse Web API operations.
>
> Built exclusively on the modern Client API. Legacy `Xrm.Page` is intentionally avoided.

![Platform](https://img.shields.io/badge/platform-Dynamics%20365-0078D4)
![Dataverse](https://img.shields.io/badge/Dataverse-Web%20API-742774)
![Language](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Why this repo

Most Dynamics 365 client scripts in the wild are copy-pasted, untyped, and still call deprecated APIs. This repo collects the patterns I use in real model-driven app implementations, each isolated so it can be dropped into a solution as a web resource with minimal changes.

Every example follows three rules:

- **Modern API only** — `executionContext` / `formContext`, never `Xrm.Page`
- **Safe by default** — null-checked lookups, guarded async calls
- **Self-contained** — each pattern runs on its own, no hidden dependencies

---

## Patterns

| # | Pattern | Client API surface |
|---|---------|--------------------|
| 01 | **Field Control** | `executionContext`, `formContext`, `getAttribute()`, `getControl()`, `setDisabled()` |
| 02 | **OnChange & Visibility** | `addOnChange()`, `getValue()`, `setVisible()` |
| 03 | **Required Level** | `setRequiredLevel()`, config-driven Object / Map |
| 04 | **Lookup Filtering** | `addPreSearch()`, `addCustomFilter()`, FetchXML |
| 05 | **Lookup Value Handling** | Lookup array, `id`, `name`, `entityType` |
| 06 | **Retrieve Record** | `Xrm.WebApi.retrieveRecord()` |
| 07 | **Retrieve Multiple Records** | `Xrm.WebApi.retrieveMultipleRecords()` |
| 08 | **Lookup + Web API** | Lookup resolution combined with Dataverse queries |
| 09 | **Form Notification** | Risk checker with `setFormNotification()` |

New patterns are added as they prove useful in production scenarios.

---

## Project structure

```
d365-client-scripting-toolkit/
│
├── README.md
│
├── form-controls/
│   ├── field-control.js
│   ├── onchange-visibility.js
│   └── required-level.js
│
├── lookups/
│   ├── filter-lookup.js
│   ├── lookup-value.js
│   └── lookup-webapi.js
│
├── webapi/
│   ├── retrieve-record.js
│   └── retrieve-multiple-records.js
│
└── notifications/
    └── form-notification.js
```

---

## Core concepts

The toolkit draws a hard line between the two objects developers most often confuse.

**Attribute — the data layer**

```js
const formContext = executionContext.getFormContext();
const attribute   = formContext.getAttribute("fieldname");
const value       = attribute.getValue();
```

Use it for reading and writing values, required level, and change events.

**Control — the UI layer**

```js
const control = formContext.getControl("fieldname");
control.setVisible(false);
control.setDisabled(true);
```

Use it for visibility, enablement, and lookup filtering.

| Concern | Entry point | Typical methods |
|---|---|---|
| Data | `getAttribute()` | `getValue()`, `setValue()`, `setRequiredLevel()`, `addOnChange()` |
| UI | `getControl()` | `setVisible()`, `setDisabled()`, `addPreSearch()`, `setNotification()` |

---

## Working with lookups

Lookup attributes return an **array**, not an object — the single most common source of runtime errors in D365 scripting.

```js
const lookup = formContext.getAttribute("parentcustomerid").getValue();

if (lookup && lookup.length > 0) {
    const { id, name, entityType } = lookup[0];
    // id arrives wrapped in braces: {00000000-0000-0000-0000-000000000000}
    const cleanId = id.replace(/[{}]/g, "");
}
```

Always guard before indexing. Always strip the braces before passing the id to the Web API.

---

## Dataverse Web API

```js
Xrm.WebApi.retrieveRecord(
    "account",
    accountId,
    "?$select=name,telephone1,websiteurl"
).then(
    result => { /* apply to form */ },
    error  => { /* surface to user, don't swallow */ }
);
```

Query patterns covered in the examples:

- `$select` — never retrieve columns you don't use
- `$filter` — server-side filtering
- `$expand` — related record traversal in a single round trip
- FetchXML — for lookup pre-search filtering

---

## Usage

1. Open the pattern folder you need and copy the script
2. Replace the schema names with the ones from your environment
3. Upload as a **JavaScript web resource** in your solution
4. Register the entry function on the relevant form event
5. Tick **Pass execution context as first parameter**

---

## Requirements

- Dynamics 365 / Power Apps model-driven app
- Dataverse environment with system customizer privileges
- Modern Client API (Unified Interface)

---

## License

MIT
---

**Author:** Nathaphan Pantong
