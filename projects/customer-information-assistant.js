/*
 * Exercise 10: Customer Information Assistant
 * Contact Form:
 * - Field: parentcustomerid
 *
 * When the user selects an Account:
 * 1. Get the Account ID from parentcustomerid.
 * 2. Use Xrm.WebApi.retrieveRecord() to get:
 *    - name
 *    - telephone1
 *    - revenue
 *    - numberofemployees
 * 3. Set Account telephone1 to Contact telephone1.
 * 4. Check Customer Level:
 *    - revenue > 10,000,000
 *    - AND numberofemployees > 100
 *    If both conditions are true:
 *    → "High Value Customer"
 *    Otherwise:
 *    → "Standard Customer"
 * 5. Display the Customer Level using Form Notification.
 * 6. Use the same Notification ID.
 * 7. If Account has no telephone1:
 *    → Clear Contact telephone1.
 * 8. If the user removes the Account:
 *    → Clear Contact telephone1.
 *    → Clear Form Notification.
 * 9. If Web API Error:
 *    → console.log(error.message)
 *    → Show Form Notification.
 *
 * Bonus:
 * - Use Object / Map for Customer Level Configuration.
 * - Create a separate Notification function.
 * - Create a separate function to clear Contact data.
 */

function customerInfoAssistant(executionContext){
    const formContext = executionContext.getFormContext()
    const parentcustomer = formContext.getAttribute("parentcustomerid").getValue()
    const telephone1 = formContext.getAttribute("telephone1")
    if (!parentcustomer || parentcustomer.length === 0) {
        console.log("parentcustomerid ไม่มีค่า")
        telephone1.setValue(null)
        formContext.ui.clearFormNotification("uniqueNotificationId")
        return
    }
    Xrm.WebApi.retrieveRecord(
        "account", 
        parentcustomer[0].id,
        "?$select=name,telephone1,revenue,numberofemployees"
    ).then(
        (result) => {
            telephone1.setValue(result.telephone1)

            if(
                result.revenue > 10_000_000
                && result.numberofemployees > 100
            ){
                formContext.ui.clearFormNotification("uniqueNotificationId")
                formContext.ui.setFormNotification("High Value Customer.", "WARNING", "uniqueNotificationId");
            }else{
                formContext.ui.clearFormNotification("uniqueNotificationId")
                formContext.ui.setFormNotification("Standard Customer.", "WARNING", "uniqueNotificationId");
            }

        }, 
        (error) => {
            console.log(error.message)
            formContext.ui.clearFormNotification("uniqueNotificationId")
            formContext.ui.setFormNotification("API Error", "WARNING", "uniqueNotificationId");
        }
    )
}