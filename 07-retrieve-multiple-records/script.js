/*
Exercise 7 — Retrieve Multiple
Retrieve all Active Accounts that have the following information:
name
telephone1
websiteurl

Use:
Xrm.WebApi.retrieveMultipleRecords()

Then display the following information in the Console:
Account Name
Phone
Website
*/

//Solution
function RetrieveMultiRecords(executionContext){
    const formContext = executionContext.getFormContext()
    Xrm.WebApi.retrieveMultipleRecords(
        "account",
        "?$select=name,telephone1,websiteurl"+
        "&$filter=statecode eq 0"
    ).then(
        function success(result){
            // retrieveMultipleRecords will return entity
            result.entities.forEach(function(account) {
                console.log("Account Name : %s", account.name)
                console.log("Phone : %s", account.telephone1)
                console.log("Website : %s", account.websiteurl)
            })
        }, 
        function (error){
            console.log("Error : ", error.message)
        }
    )
}