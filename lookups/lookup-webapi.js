/*
Exercise 8 — Web API + Lookup
In the Contact Form, there is a parentcustomerid lookup field.

When the user selects an Account:
1. Get the Account ID from parentcustomerid.
2. Use Xrm.WebApi.retrieveRecord() to retrieve the Account.
3. Retrieve the Account's telephone1.
4. Set the Account's phone number into the Contact's telephone1 field.
5. If the Account does not have a phone number → Clear the Contact's telephone1 field.
6. If an API error occurs → Display a Form Notification.

Flow:
Lookup Change
     ↓
Get Account ID
     ↓
Xrm.WebApi.retrieveRecord()
     ↓
Get telephone1
     ↓
Set Contact telephone1
*/

function lookup_WebApi(executionContext){
    const formContext = executionContext.getFormContext()
    const parentcustomerid = formContext.getAttribute("parentcustomerid").getValue()
    const telephone1 = formContext.getAttribute("telephone1")
    if (!parentcustomerid || parentcustomerid.length === 0) {
        console.log("parentcustomerid ไม่มีค่า")
        telephone1.setValue(null)
        return
    }
    Xrm.WebApi.retrieveRecord("account", parentcustomerid[0].id, "?$select=telephone1").then(
        (result) => {
            if (result.telephone1) {
                telephone1.setValue(result.telephone1)
            } else {
                telephone1.setValue(null)
            }
        },
        (error) => {
            console.log("API Error", error.message)
            formContext.ui.setFormNotification("API Error.", "WARNING", "uniqueNotificationId");
        }
    )
}
