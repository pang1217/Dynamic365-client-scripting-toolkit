/*
Exercise 9 — Customer Risk Checker
Create a function:
checkCustomerRisk(executionContext)

When the Account Form is opened, check the following fields:
revenue
numberofemployees
creditlimit

Conditions:
If all of the following conditions are met:
Revenue > 10,000,000
AND Employees > 100
AND Credit Limit > 500,000

Display the following Form Notification:
High Value Customer

If the conditions are not met, display:
Standard Customer

Bonus:
Instead of using console.log(), use Form Notification and create a Notification ID so that the notification can later be cleared using:
formContext.ui.clearFormNotification(notificationId);
*/

function checkCustomerRisk(executionContext){
    const formContext = executionContext.getFormContext()
    const revenue = formContext.getAttribute("revenue").getValue()
    const numberofemployees = formContext.getAttribute("numberofemployees").getValue()
    const creditlimit = formContext.getAttribute("creditlimit").getValue()
    if(
        revenue > 10_000_000
        && numberofemployees > 100
        && creditlimit > 500_000
    ){
        formContext.ui.clearFormNotification("uniqueNotificationId")
        formContext.ui.setFormNotification("High Value Customer.", "WARNING", "uniqueNotificationId");
    }else{
        formContext.ui.clearFormNotification("uniqueNotificationId")
        formContext.ui.setFormNotification("Standard Customer.", "WARNING", "uniqueNotificationId");
    }
}