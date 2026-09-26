// Exercise 1 — Field Control
// In the Account Form, write JavaScript that runs when the form is opened.
// Conditions:
// If telephone1 has a value → make the emailaddress1 field Read Only.
// If telephone1 has no value → make the emailaddress1 field editable.

// solution
function checkEmail_Onloads(executionContext){
    const formContext = executionContext.getFormContext()
    const telephone1 = formContext.getAttribute("telephone1")
    const telephone1Value = telephone1.getValue()
    const emailaddress1 = formContext.getControl("emailaddress1")
    emailaddress1.setDisabled(!!telephone1Value)
}