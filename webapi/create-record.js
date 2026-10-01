/*
 * Exercise 11: Create Related Record
 * Contact Form:
 * - Field: parentcustomerid
 * When the user clicks Save or calls the function:
 * 1. Get the Account from parentcustomerid
 *    and check whether an Account is selected.
 * 2. Use Xrm.WebApi.createRecord()
 *    to create a new Task.
 * 3. The Task must contain:
 *    - subject: "Follow up with Customer"
 *    - description: "Customer follow-up task"
 * 4. Set the Task's Regarding field
 *    to the Account selected in parentcustomerid.
 * 5. When the Task is created successfully:
 *    - console.log the Task ID
 *    - console.log "Task created successfully"
 * 6. If no Account is selected:
 *    - console.log("parentcustomerid has no value")
 *    - Do not create the Task.
 * 7. If an API Error occurs:
 *    - console.log(error.message)
 *    - Display a Form Notification.
 * Bonus:
 * - Use async / await.
 * - After the Task is created successfully,
 *   display the Task ID in a Form Notification.
 */

async function retrieveAccountData(id){
    return Xrm.WebApi.retrieveRecord(
        "account", 
        id, 
        "?$select=name,telephone1,websiteurl"
    )
}

async function createRecord(executionContext){
    const formContext = executionContext.getFormContext()
    const parentcustomerid = formContext.getAttribute("parentcustomerid").getValue()
    if(!parentcustomerid || parentcustomerid.length === 0){
        console.log("parentcustomerid has no value")
        return;
    }
    // retrive data
    const account = await retrieveAccountData(parentcustomerid[0].id)
    const data = {
        "regardingobjectid_account@odata.bind": `/accounts(${account.id.replace(/[{}]/g, "")})`, 
        "subject" : "Follow up with Customer" ,
        "description" : "Customer follow-up task"
    }

    // create record
    Xrm.WebApi.createRecord(
        "task", 
        data
    ).then(
        (result) => {
            console.log ("Task ID :", result.id)
            console.log ("Task created successfully")
        }, 
        (error) => {
            console.log(error.message)
            formContext.ui.clearFormNotification("uniqueNotificationId")
            formContext.ui.setFormNotification("API Error", "WARNING", "uniqueNotificationId");
        }
    )

}