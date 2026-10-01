/*
 * Exercise 12: Update Record
 * Contact Form:
 * - Field: parentcustomerid
 * When the user selects an Account:
 * 1. Get the Account from parentcustomerid
 *    and check whether an Account is selected.
 * 2. Use Xrm.WebApi.updateRecord()
 *    to update the selected Account.
 * 3. The Account must be updated with:
 *    - description: "Updated from Contact Form"
 * 4. When the update is successful:
 *    - console.log the Account ID
 *    - console.log("Account updated successfully")
 * 5. If no Account is selected:
 *    - console.log("parentcustomerid has no value")
 *    - Do not update the record.
 * 6. If an API Error occurs:
 *    - console.log(error.message)
 *    - Display a Form Notification.
 * Bonus:
 * - Use async / await.
 * - Create an updateAccountData() helper function.
 * - Clear the Form Notification when the update is successful.
 */


function updateAccountRecord(executionContext){
    const formContext = executionContext.getFormContext()
    const parentcustomerid = formContext.getAttribute("parentcustomerid").getValue()
    if(!parentcustomerid || parentcustomerid.length === 0){
        console.log("parentcustomerid has no value")
        return;
    }
    // prepare data
    const data = {
        "description" : "Updated from Contact Form"
    }
    // update record
    Xrm.WebApi.updateRecord(
        "account", //--> entity
        parentcustomerid[0].id.replace(/[{}]/g, "") ,  // --> where
        data // --> data for update
    ).then(
        (result) => {
            console.log ("Account ID :", result.id)
            console.log ("Account updated successfully")
        }, 
        (error) => {
            console.log(error.message)
            formContext.ui.clearFormNotification("uniqueNotificationId")
            formContext.ui.setFormNotification("API Error", "WARNING", "uniqueNotificationId");
        }
    )
}