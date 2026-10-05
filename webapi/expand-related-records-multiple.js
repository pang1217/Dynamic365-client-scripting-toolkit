/*
 * Exercise 17: Expand Multiple Related Records
 * Account Form:
 * When the user calls the function:
 * 1. Use Xrm.WebApi.retrieveMultipleRecords()
 *    to query Active Accounts.
 * 2. The query must:
 *    - Return only Active Accounts.
 *    - Retrieve the Account Name.
 *    - Retrieve all related Contacts.
 * 3. The related Contacts must:
 *    - Retrieve the Contact Full Name.
 *    - Retrieve the Contact Email.
 *    - Return only Contacts where emailaddress1 has a value.
 * 4. Use OData $expand
 *    to retrieve the related Contacts.
 * 5. Use the Navigation Property
 *    to access the related Contacts.
 * 6. When the query is successful:
 *    - Loop through result.entities.
 *    - console.log the Account Name.
 *    - Check whether the Account has any Related Contacts.
 *    - Loop through the Contacts.
 *    - console.log the Contact Full Name.
 *    - console.log the Contact Email.
 * 7. If an Account has no Related Contacts:
 *    - console.log("No Related Contacts")
 * 8. If an API Error occurs:
 *    - console.log(error.message)
 *
 * Bonus:
 * - Use async / await.
 * - Add $orderby for Contacts.
 * - Add $top for Related Contacts.
 * - Display the Contact Telephone.
 * - Display the number of Related Contacts.
 */

function expandRelatedRecords_Multi(executionContext){
    const formContext = executionContext.getFormContext()
    const query = 
    "?$select=name" +
    "&$filter=statecode eq 0" +
    "&$expand=contact_customer_accounts(" +
    "$select=fullname,emailaddress1" +
    "&$filter=emailaddress1 ne null"+
    "&$top=10"
    ")"

    Xrm.WebApi.retrieveMultipleRecords("account",
        query).then(
            (result) => {
                result.entities.forEach(function(account) {
                    console.log("Account Name : %s", account.name)
                    if(!account.contact_customer_accounts) {
                        console.log("No related Contact found.") 
                        return;
                    }
                    
                    // loop through the array of the related contacts
                    account.contact_customer_accounts.forEach(function(contact){
                        console.log("Contact Fullname : %s", contact.fullname)
                        console.log("Contact Email : %s", contact.emailaddress1)
                    })
                }
                )
            },
            (error) => {
                console.log("Error : ", error.message)
            }
        )
}