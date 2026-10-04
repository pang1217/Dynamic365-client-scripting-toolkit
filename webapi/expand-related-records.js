/*
 * Exercise 15: Expand Related Records
 * Account Form:
 * When the user calls the function:
 * 1. Use Xrm.WebApi.retrieveMultipleRecords()
 *    to query Active Accounts.
 * 2. The query must:
 *    - Return only Active Accounts.
 *    - Retrieve the Account Name.
 *    - Retrieve the related Primary Contact.
 *    - Retrieve the Primary Contact's name and email.
 * 3. Use OData $expand
 *    to retrieve data from the related entity.
 * 4. When the query is successful:
 *    - Loop through result.entities.
 *    - console.log the Account Name.
 *    - console.log the Primary Contact Name.
 *    - console.log the Primary Contact Email.
 * 5. If an Account has no Primary Contact:
 *    - console.log("No Primary Contact")
 * 6. If an API Error occurs:
 *    - console.log(error.message)
 *
 * Bonus:
 * - Use async / await.
 * - Add $orderby.
 * - Add $top.
 * - Retrieve multiple fields from the related entity.
 */

function expandRelatedRecords(executionContext){
    const formContext = executionContext.getFormContext()
    Xrm.WebApi.retrieveMultipleRecords(
        "account",
        "?$select=name"+
        "&$filter=statecode eq 0"+
        "&$expand=primarycontactid($select=fullname,emailaddress1)"
    ).then(
        function success(result){
            // retrieveMultipleRecords will return entity
            result.entities.forEach(function(account) {
                console.log("Account Name : %s", account.name)
                if(!account.primarycontactid) {
                    console.log("No Primary Contact") 
                    return;
                }
                console.log("Fullname : %s", account.primarycontactid.fullname)
                console.log("Email : %s", account.primarycontactid.emailaddress1)
            })
        }, 
        function (error){
            console.log("Error : ", error.message)
        }
    )
}
