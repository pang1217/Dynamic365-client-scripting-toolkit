# Dynamics 365 JavaScript Practice

A collection of JavaScript exercises for practicing **Microsoft Dynamics 365 / Power Apps Model-driven Apps Client API**.

This repository focuses on practical form scripting, lookup handling, field manipulation, and Dataverse Web API operations.

## 🎯 Goals

* Practice Dynamics 365 Client API
* Improve JavaScript skills for Model-driven Apps
* Learn reusable patterns for form scripting
* Practice working with Lookup fields
* Work with Dataverse Web API
* Build practical examples based on real-world scenarios

## 🛠️ Technologies

* JavaScript
* Microsoft Dynamics 365
* Power Apps Model-driven Apps
* Dataverse
* Dynamics 365 Client API
* Xrm.WebApi

## 📚 Exercises

| #  | Exercise                  | Topics                                                                               |
| -- | ------------------------- | ------------------------------------------------------------------------------------ |
| 01 | Field Control             | `executionContext`, `formContext`, `getAttribute()`, `getControl()`, `setDisabled()` |
| 02 | OnChange & Visibility     | `addOnChange()`, `getValue()`, `setVisible()`                                        |
| 03 | Required Level            | `setRequiredLevel()`, Object / Map configuration                                     |
| 04 | Filter Lookup             | `addPreSearch()`, `addCustomFilter()`, FetchXML                                      |
| 05 | Lookup Value              | Lookup Array, `id`, `name`, `entityType`                                             |
| 06 | Retrieve Record           | `Xrm.WebApi.retrieveRecord()`                                                        |
| 07 | Retrieve Multiple Records | `Xrm.WebApi.retrieveMultipleRecords()`                                               |
| 08 | Lookup + Web API          | Lookup handling + Dataverse Web API                                                  |
| 09 | Form Notification          | Risk Checker + Form Notification                                                  |

> More exercises will be added as I continue learning and practicing.

## 📁 Project Structure

```text
dynamics365-javascript-practice/
│
├── README.md
│
├── 01-field-control/
│   └── script.js
│
├── 02-onchange-setvisible/
│   └── script.js
│
├── 03-required-level/
│   └── script.js
│
├── 04-filter-lookup/
│   └── script.js
│
├── 05-lookup-value/
│   └── script.js
│
├── 06-retrieve-record/
│   └── script.js
│
├── 07-retrieve-multiple-records/
│   └── script.js
│
├── 08-lookup-webapi/
│   └── script.js
│
└── 09-form-notification
    └── script.js
```
****
## 🧠 Topics Covered

### Form Context

```javascript
const formContext = executionContext.getFormContext()
```

### Attribute

```javascript
const attribute = formContext.getAttribute("fieldname")
const value = attribute.getValue()
```

### Control

```javascript
const control = formContext.getControl("fieldname")
```

### Lookup

```javascript
const lookup = formContext
    .getAttribute("parentcustomerid")
    .getValue()

const id = lookup[0].id
const name = lookup[0].name
const entityType = lookup[0].entityType
```

### Dataverse Web API

```javascript
Xrm.WebApi.retrieveRecord(
    "account",
    accountId,
    "?$select=name,telephone1,websiteurl"
)
```

## 🔑 Key Principles

The exercises focus on understanding the difference between:

```text
Attribute
    ↓
getAttribute()
    ↓
getValue() / setValue()
```

and:

```text
Control
    ↓
getControl()
    ↓
setVisible() / setDisabled()
```

The repository also practices safe handling of Lookup values and asynchronous Web API operations.

## 🚀 Learning Progress

* [x] Exercise 01 — Field Control
* [x] Exercise 02 — OnChange & Visibility
* [x] Exercise 03 — Required Level
* [x] Exercise 04 — Filter Lookup
* [x] Exercise 05 — Lookup Value
* [x] Exercise 06 — Retrieve Record
* [x] Exercise 07 — Retrieve Multiple Records
* [ ] Exercise 08 — Lookup + Web API
* [ ] Exercise 09 — Form Notification

## 📌 Notes

These exercises are created for learning and practice purposes.

The examples use modern Dynamics 365 Client API patterns such as:

* `executionContext`
* `formContext`
* `Xrm.WebApi`
* Lookup APIs
* Dataverse Web API
* Event handlers

Legacy APIs such as `Xrm.Page` are intentionally avoided.

---

**Author:** Nathaphan Pantong
**Focus:** JavaScript / Dynamics 365 / Power Platform
