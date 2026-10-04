# Dynamic 365 Client Scripting Toolkit

> A curated collection of reusable client-side patterns for **Dynamics 365 / Power Apps model-driven apps** — form scripting, lookup filtering, field manipulation, notifications, and Dataverse Web API operations.

> Built exclusively on the modern Client API. Legacy `Xrm.Page` is intentionally avoided.

![Platform](https://img.shields.io/badge/platform-Dynamics%20365-0078D4)

![Dataverse](https://img.shields.io/badge/Dataverse-Web%20API-742774)

![Language](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E)

![License](https://img.shields.io/badge/license-MIT-green)

---

## Why this repo

Most Dynamics 365 client scripts in the wild are copy-pasted, untyped, and still call deprecated APIs. This repo collects the patterns I use in real model-driven app implementations, each isolated so it can be dropped into a solution as a web resource with minimal changes.

Every example follows three rules:

* **Modern API only** — `executionContext` / `formContext`, never `Xrm.Page`
* **Safe by default** — null-checked lookups, guarded async calls
* **Self-contained** — each pattern runs on its own, no hidden dependencies

---

## Patterns

| #  | Pattern                            | Client API surface                                                                   |
| -- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| 01 | **Field Control**                  | `executionContext`, `formContext`, `getAttribute()`, `getControl()`, `setDisabled()` |
| 02 | **OnChange & Visibility**          | `addOnChange()`, `getValue()`, `setVisible()`                                        |
| 03 | **Required Level**                 | `setRequiredLevel()`, config-driven Object / Map                                     |
| 04 | **Lookup Filtering**               | `addPreSearch()`, `addCustomFilter()`, FetchXML                                      |
| 05 | **Lookup Value Handling**          | Lookup array, `id`, `name`, `entityType`                                             |
| 06 | **Retrieve Record**                | `Xrm.WebApi.retrieveRecord()`                                                        |
| 07 | **Retrieve Multiple Records**      | `Xrm.WebApi.retrieveMultipleRecords()`                                               |
| 08 | **Lookup + Web API**               | Lookup resolution combined with Dataverse queries                                    |
| 09 | **Customer Risk & Notification**   | Business logic with `setFormNotification()`                                          |
| 10 | **Customer Information Assistant** | Lookup, Web API, business logic, and notifications                                   |
| 11 | **Create Related Record**          | `Xrm.WebApi.createRecord()`, `@odata.bind`, Entity Reference                         |
| 12 | **Update Record**                  | `Xrm.WebApi.updateRecord()`, Record ID, update data                                  |
| 13 | **Delete Record**                  | `Xrm.WebApi.deleteRecord()`, Entity, Record ID                                       |
| 14 | **Advanced Query & Filtering**     | `$select`, `$filter`, `$orderby`, `$top`, `retrieveMultipleRecords()`                |
| 15 | **Expand Related Records**         | `$expand`, Navigation Property, Related Entity                                       |

New patterns are added as they prove useful in production scenarios.

---

## Project structure

```text
Dynamic365-client-scripting-toolkit/
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
│   ├── retrieve-multiple-records.js
│   ├── create-record.js
│   ├── update-record.js
│   ├── delete-record.js
│   ├── advanced-query.js
│   └── expand-related-records.js
│
└── notifications/
    └── form-notification.js
```

---

## Core concepts

The toolkit draws a hard line between the two objects developers most often confuse.

### **Attribute — the data layer**

```js
const formContext = executionContext.getFormContext();

const attribute = formContext.getAttribute("fieldname");

const value = attribute.getValue();
```

Use it for reading and writing values, required level, and change events.

### **Control — the UI layer**

```js
const control = formContext.getControl("fieldname");

control.setVisible(false);

control.setDisabled(true);
```

Use it for visibility, enablement, and lookup filtering.

| Concern | Entry point      | Typical methods                                                        |
| ------- | ---------------- | ---------------------------------------------------------------------- |
| Data    | `getAttribute()` | `getValue()`, `setValue()`, `setRequiredLevel()`, `addOnChange()`      |
| UI      | `getControl()`   | `setVisible()`, `setDisabled()`, `addPreSearch()`, `setNotification()` |

---

## Working with lookups

Lookup attributes return an **array**, not an object — the single most common source of runtime errors in D365 scripting.

```js
const lookup = formContext
    .getAttribute("parentcustomerid")
    .getValue();

if (lookup && lookup.length > 0) {

    const { id, name, entityType } = lookup[0];

    // id may arrive wrapped in braces:
    // {00000000-0000-0000-0000-000000000000}

    const cleanId = id.replace(/[{}]/g, "");
}
```

Always guard before indexing.

When using a Lookup ID with the Dataverse Web API, normalize the GUID before constructing an Entity Reference.

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

The toolkit covers the main CRUD operations progressively.

| Operation         | API                         | Status  |
| ----------------- | --------------------------- | ------- |
| Retrieve          | `retrieveRecord()`          | Covered |
| Retrieve Multiple | `retrieveMultipleRecords()` | Covered |
| Create            | `createRecord()`            | Covered |
| Update            | `updateRecord()`            | Covered |
| Delete            | `deleteRecord()`            | Covered |

### Query patterns

The toolkit also demonstrates common OData query options:

* `$select` — retrieve only the columns you need
* `$filter` — server-side filtering
* `$orderby` — server-side sorting
* `$top` — limit returned records
* `$expand` — retrieve related records
* FetchXML — lookup pre-search filtering

Example:

```js
const query =
    "?$select=name,telephone1,revenue" +
    "&$filter=statecode eq 0 and revenue gt 1000000" +
    "&$orderby=revenue desc" +
    "&$top=5";

Xrm.WebApi.retrieveMultipleRecords(
    "account",
    query
);
```

### Related Records with `$expand`

`$expand` can be used to retrieve related records through a navigation property in the same Web API query.

Example:

```js
const query =
    "?$select=name" +
    "&$filter=statecode eq 0" +
    "&$expand=primarycontactid($select=fullname,emailaddress1)";

Xrm.WebApi.retrieveMultipleRecords(
    "account",
    query
);
```

The expanded record can then be accessed through the navigation property:

```js
account.primarycontactid.fullname
account.primarycontactid.emailaddress1
```

Conceptually:

```text
Account
│
├── name
│
└── primarycontactid
    │
    ├── fullname
    └── emailaddress1
```

This allows related entity data to be retrieved together with the main entity instead of making a separate Web API request for each related record.

---

## Entity References

Related Dataverse records can be connected using `@odata.bind`.

Example:

```js
const accountId = parentcustomerid[0].id.replace(/[{}]/g, "");

const data = {
    subject: "Follow up with Customer",
    description: "Customer follow-up task",
    "regardingobjectid_account@odata.bind":
        `/accounts(${accountId})`
};

Xrm.WebApi.createRecord("task", data);
```

This creates a Task and sets the selected Account as its **Regarding** record.

---

## Async JavaScript

The examples use both Promise-based and `async/await` patterns.

### **Promise**

```js
Xrm.WebApi.retrieveRecord(
    "account",
    accountId,
    "?$select=name"
).then(
    result => {
        console.log(result.name);
    },
    error => {
        console.log(error.message);
    }
);
```

### **Async / Await**

```js
async function retrieveAccountData(accountId) {
    return Xrm.WebApi.retrieveRecord(
        "account",
        accountId,
        "?$select=name"
    );
}
```

The exercises gradually move from basic Promise handling toward reusable asynchronous functions.

---

## Usage

1. Open the pattern folder you need and copy the script
2. Replace the schema names with the ones from your environment
3. Upload as a **JavaScript web resource** in your solution
4. Register the entry function on the relevant form event
5. Tick **Pass execution context as first parameter**

---

## Requirements

* Dynamics 365 / Power Apps model-driven app
* Dataverse environment
* Modern Client API (Unified Interface)
* JavaScript web resources

---

## Progress

| #  | Exercise                       | Status        |
| -- | ------------------------------ | ------------- |
| 01 | Field Control                  | [x] Completed |
| 02 | OnChange & Visibility          | [x] Completed |
| 03 | Required Level                 | [x] Completed |
| 04 | Lookup Filtering               | [x] Completed |
| 05 | Lookup Value Handling          | [x] Completed |
| 06 | Retrieve Record                | [x] Completed |
| 07 | Retrieve Multiple Records      | [x] Completed |
| 08 | Lookup + Web API               | [x] Completed |
| 09 | Customer Risk & Notification   | [x] Completed |
| 10 | Customer Information Assistant | [x] Completed |
| 11 | Create Related Record          | [x] Completed |
| 12 | Update Record                  | [x] Completed |
| 13 | Delete Record                  | [x] Completed |
| 14 | Advanced Query & Filtering     | [x] Completed |
| 15 | Expand Related Records         | [x] Completed |

---

## License

MIT

---

**Author:** Nathaphan Pantong
