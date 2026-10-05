/*
 * Exercise 16: Expand Related Records + Filtering
 * Account Form:
 * When the user calls the function:
 * 1. Use Xrm.WebApi.retrieveMultipleRecords()
 *    to query Active Accounts.
 * 2. The query must:
 *    - Return only Active Accounts.
 *    - Retrieve the Account Name.
 *    - Retrieve the related Primary Contact.
 * 3. The Primary Contact must:
 *    - Have an email address.
 *    - Return only Contacts where emailaddress1 has a value.
 * 4. Use OData $expand
 *    to retrieve data from the related entity.
 * 5. When the query is successful:
 *    - Loop through result.entities.
 *    - console.log the Account Name.
 *    - console.log the Primary Contact Name.
 *    - console.log the Primary Contact Email.
 * 6. If an Account has no Primary Contact:
 *    - console.log("No Primary Contact")
 * 7. If the Primary Contact has no email:
 *    - console.log("Primary Contact has no email")
 * 8. If an API Error occurs:
 *    - console.log(error.message)
 *
 * Bonus:
 * - Use async / await.
 * - Add $orderby to sort by Account Name.
 * - Add $top.
 * - Display the Account Telephone.
 * - Display the Primary Contact Telephone.
 */

function expandAndFilterRecord(executionContext){
    const formContext = executionContext.getFormContext()
    Xrm.WebApi.retrieveMultipleRecords(
        "account",
        "?$select=name" +
        "&$filter=statecode eq 0"+
        "&$orderby=name desc"+
        "&$expand=primarycontactid(" + 
        "$select=fullname,emailaddress1"+
        "&$filter=emailaddress1 ne null"+
        ")"
    ).then(
        (result) => {
            result.entities.forEach(function(account) {
                console.log("Account Name : %s", account.name)
                if(!account.primarycontactid) {
                    console.log("No Primary Contact") 
                    return;
                }
                console.log("Fullname : %s", account.primarycontactid.fullname)
                if(!account.primarycontactid.emailaddress1) {
                    console.log("Primary Contact has no email") 
                    return;
                }
                console.log("Email : %s", account.primarycontactid.emailaddress1)
            }
            )
        },
        (error) => {
            console.log("Error : ", error.message)
        }
    )
}