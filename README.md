# Dynamic 365 Client Scripting Toolkit

> A curated collection of reusable client-side patterns for **Dynamics 365 / Power Apps model-driven apps** — form scripting, lookup filtering, field manipulation, notifications, and Dataverse Web API operations.

> Built exclusively on the modern Client API. Legacy `Xrm.Page` is intentionally avoided.

![Platform](https://img.shields.io/badge/platform-Dynamics%20365-0078D4)
![Dataverse](https://img.shields.io/badge/Dataverse-Web%20API-742774)
![Language](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Why this repo

Most Dynamics 365 client scripts in the wild are copy-pasted, untyped, and still call deprecated APIs. This repo collects reusable patterns for model-driven app implementations, each isolated so it can be dropped into a solution as a web resource with minimal changes.

Every example follows three rules:

* **Modern API only** — `executionContext` / `formContext`, never `Xrm.Page`
* **Safe by default** — null-checked lookups, guarded async calls
* **Self-contained** — each pattern runs on its own, no hidden dependencies

---

## Patterns

| #  | Pattern                                   | Client API surface                                                                   |
| -- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| 01 | **Field Control**                         | `executionContext`, `formContext`, `getAttribute()`, `getControl()`, `setDisabled()` |
| 02 | **OnChange & Visibility**                 | `addOnChange()`, `getValue()`, `setVisible()`                                        |
| 03 | **Required Level**                        | `setRequiredLevel()`, config-driven Object / Map                                     |
| 04 | **Lookup Filtering**                      | `addPreSearch()`, `addCustomFilter()`, FetchXML                                      |
| 05 | **Lookup Value Handling**                 | Lookup array, `id`, `name`, `entityType`                                             |
| 06 | **Retrieve Record**                       | `Xrm.WebApi.retrieveRecord()`                                                        |
| 07 | **Retrieve Multiple Records**             | `Xrm.WebApi.retrieveMultipleRecords()`                                               |
| 08 | **Lookup + Web API**                      | Lookup resolution combined with Dataverse queries                                    |
| 09 | **Customer Risk & Notification**          | Business logic with `setFormNotification()`                                          |
| 10 | **Customer Information Assistant**        | Lookup, Web API, business logic, and notifications                                   |
| 11 | **Create Related Record**                 | `Xrm.WebApi.createRecord()`, `@odata.bind`, Entity Reference                         |
| 12 | **Update Record**                         | `Xrm.WebApi.updateRecord()`, Record ID, update data                                  |
| 13 | **Delete Record**                         | `Xrm.WebApi.deleteRecord()`, Entity, Record ID                                       |
| 14 | **Advanced Query & Filtering**            | `$select`, `$filter`, `$orderby`, `$top`, `retrieveMultipleRecords()`                |
| 15 | **Expand Related Records**                | `$expand`, Navigation Property, Related Entity                                       |
| 16 | **Expand Related Records + Filtering**    | `$expand`, Related Entity, nested `$filter`                                          |
| 17 | **Expand Multiple Related Records**       | Collection-valued Navigation Property, nested `$select`, `$filter`, `$top`           |
| 18 | **Retrieve Multiple Records with Paging** | `result.nextLink`, `$top`, `$count`, Pagination, recursive retrieval                 |
| 19 | **Execute Multiple Requests**             | `Xrm.WebApi.online.executeMultiple()`, Request Object, `getMetadata()`, Batch Update |

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
│   ├── retrieve-multiple-records-paging.js
│   └── execute-multiple.js
│
└── notifications/
    └── form-notification.js
```

---

## Core concepts

The toolkit draws a hard line between the two objects developers most often confuse.

### Attribute — the data layer

```js
const formContext = executionContext.getFormContext();

const attribute = formContext.getAttribute("fieldname");

const value = attribute.getValue();
```

Use it for reading and writing values, required level, and change events.

### Control — the UI layer

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
    result => {
        // apply to form
    },
    error => {
        // surface to user, don't swallow
    }
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
* `$count` — return total matching record count
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

---

## Related Records with `$expand`

`$expand` allows a query to retrieve related records together with the main entity.

Example:

```js
const query =
    "?$select=name" +
    "&$filter=statecode eq 0" +
    "&$expand=primarycontactid(" +
        "$select=fullname,emailaddress1" +
    ")";
```

The result can then be accessed through the navigation property:

```js
result.entities.forEach(function(account) {

    console.log("Account Name : " + account.name);

    if (!account.primarycontactid) {
        console.log("No Primary Contact");
        return;
    }

    console.log(
        "Contact Name : " +
        account.primarycontactid.fullname
    );

    console.log(
        "Contact Email : " +
        account.primarycontactid.emailaddress1
    );
});
```

Conceptually:

```text
account
├── name
└── primarycontactid
    ├── fullname
    └── emailaddress1
```

The navigation property name depends on the Dataverse relationship metadata and should be verified in the target environment.

---

## Filtering Related Records

A nested `$filter` can be used inside `$expand`.

```js
const query =
    "?$select=name" +
    "&$filter=statecode eq 0" +
    "&$expand=primarycontactid(" +
        "$select=fullname,emailaddress1" +
        "&$filter=emailaddress1 ne null" +
    ")";
```

The important distinction is:

```text
Main $filter
    ↓
filters Account

Nested $filter
    ↓
filters related Contact
```

---

## Multiple Related Records

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
```

The related records can then be processed with `forEach()`:

```js
result.entities.forEach(function(account) {

    console.log("Account Name : " + account.name);

    if (!account.contact_customer_accounts) {
        console.log("No Related Contacts");
        return;
    }

    account.contact_customer_accounts.forEach(function(contact) {

        console.log(
            "Contact Fullname : " +
            contact.fullname
        );

        console.log(
            "Contact Email : " +
            contact.emailaddress1
        );

    });
});
```

Conceptually:

```text
account
├── name
└── contact_customer_accounts[]
    ├── contact
    ├── contact
    └── contact
```

The navigation property must match the relationship metadata in the target Dataverse environment.

---

## Pagination

`retrieveMultipleRecords()` may return a `nextLink` when more records are available.

```js
Xrm.WebApi.retrieveMultipleRecords(
    "account",
    "?$select=name,telephone1" +
    "&$filter=statecode eq 0" +
    "&$top=10" +
    "&$orderby=name desc" +
    "&$count=true"
).then(
    result => {

        console.log(result.entities);

        if (result.nextLink) {
            getNextPage(result.nextLink);
        }

    },
    error => {
        console.log(error.message);
    }
);
```

The `nextLink` should be passed directly into the next `retrieveMultipleRecords()` call.

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
            console.log("Error : " + error.message);
        }
    );
}
```

### Why `push(...entities)`?

```js
accounts.push(...nextResult.entities);
```

The spread operator expands the array so every entity is added to the existing accumulator.

```text
nextResult.entities
        ↓
[Account1, Account2, Account3]
        ↓
       ...
        ↓
accounts
[Account1, Account2, Account3]
```

This allows records from multiple pages to be stored in one array.

---

## Execute Multiple Requests

`Xrm.WebApi.online.executeMultiple()` allows multiple Dataverse requests to be sent as a batch.

A request object contains the target entity, record ID, payload, and metadata describing the operation.

Example:

```js
const updateData = {
    description: "Updated using Execute Multiple"
};

const requests = [];

result.entities.forEach(function(account) {

    const request = {

        etn: "account",

        id: account.accountid.replace(/[{}]/g, ""),

        payload: updateData,

        getMetadata: function() {

            return {
                boundParameter: null,
                parameterTypes: {},
                operationType: 2,
                operationName: "Update"
            };

        }

    };

    requests.push(request);
});

Xrm.WebApi.online.executeMultiple(requests);
```

The request flow is:

```text
retrieveMultipleRecords()
        ↓
Retrieve Accounts
        ↓
Create requests[]
        ↓
Request 1 → Update Account
Request 2 → Update Account
Request 3 → Update Account
        ↓
executeMultiple(requests)
        ↓
Batch Request
```

### Request metadata

For an Update request:

```js
getMetadata: function() {

    return {
        boundParameter: null,
        parameterTypes: {},
        operationType: 2,
        operationName: "Update"
    };

}
```

`operationType: 2` represents an Update operation.

### Processing batch responses

Each response can be checked individually:

```js
response.forEach(function(res, index) {

    console.log("Request " + index);

    if (res.ok) {
        console.log("Success");
    } else {
        console.log("Failed");
    }

});
```

This is useful when a batch contains multiple independent operations and individual request results need to be inspected.

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

### Promise

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

### Async / Await

```js
async function retrieveAccountData(accountId) {

    return Xrm.WebApi.retrieveRecord(
        "account",
        accountId,
        "?$select=name"
    );

}
```

The exercises gradually move from basic Promise handling toward reusable asynchronous functions, recursive pagination, and batch operations.

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
| 19 | Execute Multiple Requests             | [x] Completed |

---

## License

MIT

---

**Author:** Nathaphan Pantong
