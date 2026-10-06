/*
 * Exercise 18: Retrieve Multiple Records with Paging
 * Account Form:
 * When the user calls the function:
 * 1. Use Xrm.WebApi.retrieveMultipleRecords()
 *    to query Accounts.
 * 2. The query must:
 *    - Return only Active Accounts.
 *    - Retrieve the Account Name.
 *    - Retrieve the Telephone.
 *    - Sort by Account Name.
 *    - Limit the number of records per page.
 * 3. Use $top to limit the number of records
 *    retrieved in each request.
 * 4. When the query is successful:
 *    - Loop through result.entities.
 *    - console.log the Account Name.
 *    - console.log the Telephone.
 * 5. Check whether:
 *    - There is a next page.
 *    - Use result.nextLink when a next page exists.
 * 6. If there is a next page:
 *    - Call Xrm.WebApi.retrieveMultipleRecords()
 *      using the nextLink.
 *    - Display the records from the next page.
 * 7. Continue retrieving pages
 *    until there is no next page.
 * 8. When all records have been retrieved:
 *    - console.log the total number of Accounts.
 * 9. If an API Error occurs:
 *    - console.log(error.message)
 *
 * Bonus:
 * - Use async / await.
 * - Create a function to retrieve each page.
 * - Store all Accounts in a single Array.
 * - Display the total number of Records.
 */

function getNextPage(nextLink, Accounts) {
    Xrm.WebApi.retrieveMultipleRecords(
        "account",
        nextLink
    ).then(
        (nextResult) => {
            Accounts.push(...nextResult.entities)
            nextResult.entities.forEach(function(account) {
                console.log("Account Name : " + account.name)
                console.log("Telephone : " + account.telephone1)
            })
            if(nextResult.nextLink) {
                getNextPage(nextResult.nextLink, Accounts)
            } else {
                console.log("Finished pagination")
                console.log("Total records stored : " + Accounts.length)
                console.log(Accounts)
            }
        },
        (error) => {
            console.log("Error : " + error.message)
        }
    )
}


function retrieveMulti_Paging(executionContext){
    const formContext = executionContext.getFormContext()
    var allAccounts = [];

    Xrm.WebApi.retrieveMultipleRecords("account", 
        "?$select=name,telephone1" +
        "&$filter=statecode eq 0" +
        "&$top=10" +
        "&$orderby=name desc" +
        "&$count=true"
    ).then(
        (result) => {
            // note
            // • Without ...: You try to swallow the entire cardboard box whole.
            // • With ...: You open the box and eat the donuts one by one.
            allAccounts.push(...result.entities)
            // 1. Process the records on the current page
            for (var i = 0; i < result.entities.length; i++) {
                console.log("Account Name : " + result.entities[i].name);
                console.log("Telephone : " + result.entities[i].telephone1);
            }
            if (result.nextLink) {
                getNextPage(result.nextLink, allAccounts)
            }else {
                console.log("--- Only One Page Available ---");
                console.log("Total records stored in array: " + allAccounts.length);
                console.log(allAccounts);
            }
        },
        (error) => {
            console.log(error.message);
        }
    );
}
