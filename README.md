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

| #  | Pattern                                   | Client API surface                                                                    |
| -- | ----------------------------------------- | ------------------------------------------------------------------------------------- |
| 01 | **Field Control**                         | `executionContext`, `formContext`, `getAttribute()`, `getControl()`, `setDisabled()`  |
| 02 | **OnChange & Visibility**                 | `addOnChange()`, `getValue()`, `setVisible()`                                         |
| 03 | **Required Level**                        | `setRequiredLevel()`, config-driven Object / Map                                      |
| 04 | **Lookup Filtering**                      | `addPreSearch()`, `addCustomFilter()`, FetchXML                                       |
| 05 | **Lookup Value Handling**                 | Lookup array, `id`, `name`, `entityType`                                              |
| 06 | **Retrieve Record**                       | `Xrm.WebApi.retrieveRecord()`                                                         |
| 07 | **Retrieve Multiple Records**             | `Xrm.WebApi.retrieveMultipleRecords()`                                                |
| 08 | **Lookup + Web API**                      | Lookup resolution combined with Dataverse queries                                     |
| 09 | **Customer Risk & Notification**          | Business logic with `setFormNotification()`                                           |
| 10 | **Customer Information Assistant**        | Lookup, Web API, business logic, and notifications                                    |
| 11 | **Create Related Record**                 | `Xrm.WebApi.createRecord()`, `@odata.bind`, Entity Reference                          |
| 12 | **Update Record**                         | `Xrm.WebApi.updateRecord()`, Record ID, update data                                   |
| 13 | **Delete Record**                         | `Xrm.WebApi.deleteRecord()`, Entity, Record ID                                        |
| 14 | **Advanced Query & Filtering**            | `$select`, `$filter`, `$orderby`, `$top`, `retrieveMultipleRecords()`                 |
| 15 | **Expand Related Records**                | `$expand`, Navigation Property, Related Entity                                        |
| 16 | **Expand Related Records + Filtering**    | `$expand`, Related Entity, nested `$filter`                                           |
| 17 | **Expand Multiple Related Records**       | `$expand`, Collection-valued Navigation Property, nested `$select`, `$filter`, `$top` |
| 18 | **Retrieve Multiple Records with Paging** | `result.nextLink`, `$top`, `$count`, Pagination, recursive retrieval                  |

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
│   ├── expand-related-records.js
│   ├── expand-related-records-filter.js
│   └── retrieve-multiple-records-paging.js
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
* `$count` — request the total matching record count
* `$expand` — related record traversal
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

`$expand` can be used to retrieve related records together with the main record.

For example, an Account can retrieve its Primary Contact:

```js
const query =
    "?$select=name" +
    "&$filter=statecode eq 0" +
    "&$expand=primarycontactid(" +
        "$select=fullname,emailaddress1" +
    ")";

Xrm.WebApi.retrieveMultipleRecords(
    "account",
    query
);
```

The returned structure can be accessed as:

```text
account
├── name
└── primarycontactid
    ├── fullname
    └── emailaddress1
```

`primarycontactid` is a navigation property that points to the related Contact.

### Filtering Related Records

A `$filter` can also be applied inside `$expand`.

```js
const query =
    "?$select=name" +
    "&$filter=statecode eq 0" +
    "&$expand=primarycontactid(" +
        "$select=fullname,emailaddress1" +
        "&$filter=emailaddress1 ne null" +
    ")";

Xrm.WebApi.retrieveMultipleRecords(
    "account",
    query
);
```

The outer `$filter` applies to the Account.

The nested `$filter` applies to the related Contact.

### Multiple Related Records

Collection-valued navigation properties return an array of related records.

```js
const query =
    "?$select=name" +
    "&$filter=statecode eq 0" +
    "&$expand=contact_customer_accounts(" +
        "$select=fullname,emailaddress1" +
        "&$filter=emailaddress1 ne null" +
        "&$top=10" +
    ")";

Xrm.WebApi.retrieveMultipleRecords(
    "account",
    query
);
```

The related records can then be processed with `forEach()`:

```js
account.contact_customer_accounts.forEach(function(contact) {

    console.log(
        "Contact Fullname : %s",
        contact.fullname
    );

    console.log(
        "Contact Email : %s",
        contact.emailaddress1
    );

});
```

Navigation property names depend on the Dataverse environment and relationship metadata. Verify the actual navigation property before using it in `$expand`.

### Pagination with `nextLink`

`retrieveMultipleRecords()` can return a `nextLink` when more records are available than the current page.

A query can use `$top` to control the number of records requested per page:

```js
const query =
    "?$select=name,telephone1" +
    "&$filter=statecode eq 0" +
    "&$top=10" +
    "&$orderby=name desc" +
    "&$count=true";

Xrm.WebApi.retrieveMultipleRecords(
    "account",
    query
).then(
    result => {

        result.entities.forEach(function(account) {

            console.log("Account Name : " + account.name);
            console.log("Telephone : " + account.telephone1);

        });

        if (result.nextLink) {

            // Request the next page
            Xrm.WebApi.retrieveMultipleRecords(
                "account",
                result.nextLink
            );

        }

    },
    error => {

        console.log(error.message);

    }
);
```

For multiple pages, the `nextLink` can be passed recursively to a helper function:

```js
function getNextPage(nextLink, accounts) {

    Xrm.WebApi.retrieveMultipleRecords(
        "account",
        nextLink
    ).then(
        nextResult => {

            accounts.push(...nextResult.entities);

            if (nextResult.nextLink) {

                getNextPage(
                    nextResult.nextLink,
                    accounts
                );

            } else {

                console.log(
                    "Total records stored : " +
                    accounts.length
                );

            }

        },
        error => {

            console.log(
                "Error : " +
                error.message
            );

        }
    );
}
```

Using the spread operator with `push()` adds each returned entity to the existing array:

```js
accounts.push(...nextResult.entities);
```

This keeps all records in a single array while the pagination continues.

---

## Entity References

Related Dataverse records can be connected using `@odata.bind`.

Example:

```js
const accountId =
    parentcustomerid[0].id.replace(/[{}]/g, "");

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

The exercises gradually move from basic Promise handling toward reusable asynchronous functions, recursive pagination, and reusable asynchronous helpers.

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

| #  | Exercise                                  | Status        |
| -- | ----------------------------------------- | ------------- |
| 01 | Field Control                             | [x] Completed |
| 02 | OnChange & Visibility                     | [x] Completed |
| 03 | Required Level                            | [x] Completed |
| 04 | Lookup Filtering                          | [x] Completed |
| 05 | Lookup Value Handling                     | [x] Completed |
| 06 | Retrieve Record                           | [x] Completed |
| 07 | Retrieve Multiple Records                 | [x] Completed |
| 08 | Lookup + Web API                          | [x] Completed |
| 09 | Customer Risk & Notification              | [x] Completed |
| 10 | Customer Information Assistant            | [x] Completed |
| 11 | Create Related Record                     | [x] Completed |
| 12 | Update Record                             | [x] Completed |
| 13 | Delete Record                             | [x] Completed |
| 14 | Advanced Query & Filtering                | [x] Completed |
| 15 | Expand Related Records                | [x] Completed |
| 16 | Expand Related Records + Filtering    | [x] Completed |
| 17 | Expand Multiple Related Records       | [x] Completed |
| 18 | Retrieve Multiple Records with Paging | [x] Completed |

---

## License

MIT

---

**Author:** Nathaphan Pantong
