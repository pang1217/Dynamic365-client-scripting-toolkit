# Dynamic 365 Client Scripting Toolkit

> A curated collection of reusable client-side patterns for **Dynamics 365 / Power Apps model-driven apps** — form scripting, lookup filtering, field manipulation, notifications, and Dataverse Web API operations.

> Built exclusively on the modern Client API. Legacy `Xrm.Page` is intentionally avoided.

![Platform](https://img.shields.io/badge/platform-Dynamics%20365-0078D4)
![Dataverse](https://img.shields.io/badge/Dataverse-Web%20API-742774)
![Language](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Why this repo

Most Dynamics 365 client scripts in the wild are copy-pasted, untyped, and still call deprecated APIs. This repo collects reusable patterns for model-driven app implementations, each isolated so it can be adapted as a JavaScript web resource with minimal changes.

Every example follows three rules:

* **Modern API only** — `executionContext` / `formContext`, never `Xrm.Page`
* **Safe by default** — null-checked lookups and guarded async calls
* **Self-contained** — each pattern runs on its own, with no hidden dependencies

---

## Patterns

| #  | Pattern                                   | Client API / Concept                                                                 |
| -- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| 01 | **Field Control**                         | `executionContext`, `formContext`, `getAttribute()`, `getControl()`, `setDisabled()` |
| 02 | **OnChange & Visibility**                 | `addOnChange()`, `getValue()`, `setVisible()`                                        |
| 03 | **Required Level**                        | `setRequiredLevel()`, configuration-driven logic                                     |
| 04 | **Lookup Filtering**                      | `addPreSearch()`, `addCustomFilter()`, FetchXML                                      |
| 05 | **Lookup Value Handling**                 | Lookup array, `id`, `name`, `entityType`                                             |
| 06 | **Retrieve Record**                       | `Xrm.WebApi.retrieveRecord()`                                                        |
| 07 | **Retrieve Multiple Records**             | `Xrm.WebApi.retrieveMultipleRecords()`                                               |
| 08 | **Lookup + Web API**                      | Lookup resolution + Dataverse queries                                                |
| 09 | **Customer Risk & Notification**          | Business logic + `setFormNotification()`                                             |
| 10 | **Customer Information Assistant**        | Lookup, Web API, business logic, notifications                                       |
| 11 | **Create Related Record**                 | `createRecord()`, `@odata.bind`, Entity Reference                                    |
| 12 | **Update Record**                         | `updateRecord()`, Record ID, update data                                             |
| 13 | **Delete Record**                         | `deleteRecord()`, Entity, Record ID                                                  |
| 14 | **Advanced Query & Filtering**            | `$select`, `$filter`, `$orderby`, `$top`                                             |
| 15 | **Expand Related Records**                | `$expand`, single related record                                                     |
| 16 | **Expand Related Records + Filtering**    | Nested `$filter` inside `$expand`                                                    |
| 17 | **Expand Multiple Related Records**       | Collection-valued navigation property, nested `forEach()`                            |
| 18 | **Retrieve Multiple Records with Paging** | `nextLink`, recursive pagination                                                     |
| 19 | **Execute Multiple Requests**             | `Xrm.WebApi.online.executeMultiple()`, Update Request                                |
| 20 | **Execute Multiple + Create Records**     | Create Request, `@odata.bind`, batch creation                                        |

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
│   ├── expand-multiple-related-records.js
│   ├── retrieve-multiple-records-paging.js
│   ├── execute-multiple.js
│   └── execute-multiple-create.js
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

Use attributes for reading and writing field values, required levels, and change events.

### Control — the UI layer

```js
const control = formContext.getControl("fieldname");

control.setVisible(false);
control.setDisabled(true);
```

Use controls for visibility, enablement, notifications, and lookup filtering.

| Concern | Entry point      | Typical methods                                                        |
| ------- | ---------------- | ---------------------------------------------------------------------- |
| Data    | `getAttribute()` | `getValue()`, `setValue()`, `setRequiredLevel()`, `addOnChange()`      |
| UI      | `getControl()`   | `setVisible()`, `setDisabled()`, `addPreSearch()`, `setNotification()` |

---

## Working with lookups

Lookup attributes return an **array**, not an object.

```js
const lookup = formContext
    .getAttribute("parentcustomerid")
    .getValue();

if (lookup && lookup.length > 0) {

    const { id, name, entityType } = lookup[0];

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
        console.log(result.name);
    },
    error => {
        console.log(error.message);
    }
);
```

The toolkit progressively covers the main CRUD operations:

| Operation         | API                         | Status  |
| ----------------- | --------------------------- | ------- |
| Retrieve          | `retrieveRecord()`          | Covered |
| Retrieve Multiple | `retrieveMultipleRecords()` | Covered |
| Create            | `createRecord()`            | Covered |
| Update            | `updateRecord()`            | Covered |
| Delete            | `deleteRecord()`            | Covered |

---

## Query patterns

The toolkit demonstrates common OData query options:

* `$select` — retrieve only the columns you need
* `$filter` — server-side filtering
* `$orderby` — server-side sorting
* `$top` — limit returned records
* `$expand` — retrieve related records
* `$count` — request the total matching record count
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

## `$expand` — Related Records

`$expand` allows related records to be retrieved as part of the same query.

### Single related record

```js
const query =
    "?$select=name" +
    "&$expand=primarycontactid(" +
        "$select=fullname,emailaddress1" +
    ")";
```

The returned structure can be treated conceptually as:

```text
Account
├── name
└── primarycontactid
    ├── fullname
    └── emailaddress1
```

For a single related record, access the properties directly:

```js
account.primarycontactid.fullname
```

### Related record filtering

Nested `$filter` can be applied inside `$expand`:

```js
const query =
    "?$select=name" +
    "&$expand=primarycontactid(" +
        "$select=fullname,emailaddress1" +
        "&$filter=emailaddress1 ne null" +
    ")";
```

This separates:

* Main entity filtering
* Related entity filtering

---

## Multiple Related Records

Collection-valued navigation properties return an **array**.

```js
account.contact_customer_accounts.forEach(function (contact) {

    console.log("Contact Fullname:", contact.fullname);
    console.log("Contact Email:", contact.emailaddress1);

});
```

Conceptually:

```text
Account
├── name
└── contact_customer_accounts[]
    ├── Contact
    ├── Contact
    └── Contact
```

Use `forEach()` when the navigation property represents multiple related records.

---

## Pagination

`retrieveMultipleRecords()` can return a `nextLink` when more records are available.

```js
if (result.nextLink) {
    getNextPage(result.nextLink, allAccounts);
}
```

The next request should use the returned `nextLink` directly:

```js
Xrm.WebApi.retrieveMultipleRecords(
    "account",
    nextLink
);
```

A typical pagination flow is:

```text
Request Page 1
     ↓
result.entities
     ↓
result.nextLink ?
   ↙       ↘
 Yes        No
 ↓           ↓
Page 2     Finished
 ↓
Page 3
 ↓
...
```

An accumulator array can be used to store all records:

```js
allAccounts.push(...result.entities);
```

This allows the final script to work with the complete result set after pagination finishes.

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

## Execute Multiple

`Xrm.WebApi.online.executeMultiple()` allows multiple requests to be submitted as a batch.

### Update Multiple Records

Exercise 19 demonstrates building multiple Update Requests:

```js
const requests = [];

result.entities.forEach(function (account) {

    requests.push({
        etn: "account",
        id: account.accountid.replace(/[{}]/g, ""),
        payload: {
            description: "Updated using Execute Multiple"
        },
        getMetadata: function () {
            return {
                boundParameter: null,
                parameterTypes: {},
                operationType: 2,
                operationName: "Update"
            };
        }
    });

});

Xrm.WebApi.online.executeMultiple(requests);
```

The important structure is:

```text
Retrieve Records
      ↓
Build Request Objects
      ↓
requests[]
      ↓
executeMultiple(requests)
      ↓
Process Responses
```

---

## Execute Multiple + Create Records

Exercise 20 extends the Execute Multiple pattern from **Update** to **Create**.

The exercise retrieves active Accounts and creates one Task for each Account.

```text
Active Accounts
      ↓
map()
      ↓
Create Request × N
      ↓
executeMultiple()
      ↓
Create Tasks
      ↓
Success / Failed
```

A Create Request contains:

* `etn`
* `payload`
* `getMetadata()`

Example structure:

```js
const request = {

    etn: "task",

    payload: {

        subject: "Follow up with Customer",

        description: "Created using Execute Multiple",

        "regardingobjectid_account_task@odata.bind":
            `/accounts(${accountId})`
    },

    getMetadata: function () {

        return {

            boundParameter: null,

            parameterTypes: {},

            operationType: 2,

            operationName: "Create"
        };
    }
};
```

Multiple requests can then be submitted:

```js
const responses =
    await Xrm.WebApi.online.executeMultiple(batchRequests);
```

Each response can be checked individually:

```js
responses.forEach(function (response, index) {

    if (response.ok) {

        console.log(`Request #${index + 1}: Success`);

    } else {

        console.log(
            `Request #${index + 1}: Failed`
        );
    }

});
```

This pattern demonstrates how a single operation can be transformed into a reusable batch workflow:

```text
Account 1 → Create Task
Account 2 → Create Task
Account 3 → Create Task
Account 4 → Create Task
       ↓
executeMultiple()
       ↓
Batch Request
```

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

The exercises gradually move from basic Promise handling toward reusable asynchronous functions and batch operations.

---

## Usage

1. Open the pattern folder you need and copy the script
2. Replace the schema names with those from your environment
3. Upload the script as a **JavaScript web resource**
4. Register the entry function on the relevant form event
5. Enable **Pass execution context as first parameter**
6. Test the script in a development environment before using it in production

---

## Requirements

* Dynamics 365 / Power Apps model-driven app
* Dataverse environment
* Modern Client API / Unified Interface
* JavaScript web resources

---

## Progress

| #  | Exercise                              | Status        |
| -- | ------------------------------------- | ------------- |
| 01 | Field Control                         | [x] Completed |
| 02 | OnChange & Visibility                 | [x] Completed |
| 03 | Required Level                        | [x] Completed |
| 04 | Lookup Filtering                      | [x] Completed |
| 05 | Lookup Value Handling                 | [x] Completed |
| 06 | Retrieve Record                       | [x] Completed |
| 07 | Retrieve Multiple Records             | [x] Completed |
| 08 | Lookup + Web API                      | [x] Completed |
| 09 | Customer Risk & Notification          | [x] Completed |
| 10 | Customer Information Assistant        | [x] Completed |
| 11 | Create Related Record                 | [x] Completed |
| 12 | Update Record                         | [x] Completed |
| 13 | Delete Record                         | [x] Completed |
| 14 | Advanced Query & Filtering            | [x] Completed |
| 15 | Expand Related Records                | [x] Completed |
| 16 | Expand Related Records + Filtering    | [x] Completed |
| 17 | Expand Multiple Related Records       | [x] Completed |
| 18 | Retrieve Multiple Records with Paging | [x] Completed |
| 19 | Execute Multiple Requests             | [x] Completed |
| 20 | Execute Multiple + Create Records     | [x] Completed |

---

## License

MIT

---

**Author:** Nathaphan Pantong
