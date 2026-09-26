/*
Exercise 4 — Filter Lookup
In the Contact Form, there is a Lookup field:
parentcustomerid

Requirements:
Users should only be able to select Active Accounts.
Contacts must not be displayed in the Lookup.
*/

// Solution
function ListContact_OnLoad(executionContext){
    const formContext = executionContext.getFormContext()
    const control = formContext.getControl("parentcustomerid")
    control.addPreSearch(function (){filterAccount(control)})
    // VVVV -- Can write like this (closure)
    // control.addPreSearch(() => filterAccount(control));
}

function filterAccount(control){
    var customerAccountFilter = "<filter type='and'><condition attribute='statecode' operator='eq' value='0'/></filter>";
    control.addCustomFilter(customerAccountFilter, "account");
}