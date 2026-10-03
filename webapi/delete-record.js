/*
 * Exercise 13: Delete Record
 * Contact Form:
 * - Field: parentcustomerid
 *
 * When the user selects an Account:
 * 1. Get the Account from parentcustomerid
 *    and check whether an Account is selected.
 * 2. Use Xrm.WebApi.deleteRecord()
 *    to delete the selected Account.
 * 3. When the deletion is successful:
 *    - console.log the Account ID
 *    - console.log("Account deleted successfully")
 * 4. If no Account is selected:
 *    - console.log("parentcustomerid has no value")
 *    - Do not delete the record.
 * 5. If an API Error occurs:
 *    - console.log(error.message)
 *    - Display a Form Notification.
 *
 * Bonus:
 * - Use async / await.
 * - Create a deleteAccountRecord() helper function.
 * - Clear the Form Notification when the deletion is successful.
 */


function deleteAccountRecord(id, formContext){
    // delete record
    Xrm.WebApi.deleteRecord(
        "account", //--> entity
        id  // --> where
    ).then(
        (result) => {
            console.log ("Account ID :", result.id)
            console.log ("Account deleted successfully")
        }, 
        (error) => {
            console.log(error.message)
            formContext.ui.clearFormNotification("uniqueNotificationId")
            formContext.ui.setFormNotification("API Error", "WARNING", "uniqueNotificationId");
        }
    )
}

function main(executionContext){
    const formContext = executionContext.getFormContext()
    const parentcustomerid = formContext.getAttribute("parentcustomerid").getValue()
    if(!parentcustomerid || parentcustomerid.length === 0){
        console.log("parentcustomerid has no value")
        return;
    }
    deleteAccountRecord(parentcustomerid[0].id.replace(/[{}]/g, ""), formContext)
}