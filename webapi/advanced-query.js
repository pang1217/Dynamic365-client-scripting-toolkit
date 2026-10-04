/*
 * Exercise 14: Advanced Query & Filtering
 * Account Form:
 * When the user calls the function:
 * 1. Use Xrm.WebApi.retrieveMultipleRecords()
 *    to query Accounts.
 * 2. The query must:
 *    - Return only Active Accounts.
 *    - Return Accounts with revenue greater than 1,000,000.
 *    - Sort by revenue in descending order.
 *    - Return a maximum of 5 records.
 * 3. Retrieve only the following fields:
 *    - name
 *    - telephone1
 *    - revenue
 * 4. When the query is successful:
 *    - Loop through result.entities.
 *    - console.log the Account Name.
 *    - console.log the Telephone.
 *    - console.log the Revenue.
 * 5. If an API Error occurs:
 *    - console.log(error.message)
 *
 * Bonus:
 * - Use async / await.
 * - Create a separate helper function for the query.
 * - Use $expand to retrieve data from a related entity.
 */

function advancedQueryAndFilter(executionContext){
    const formContext = executionContext.getFormContext()
    Xrm.WebApi.retrieveMultipleRecords(
        "account",
        "?$select=name,telephone1,revenue"+
        "&$filter=statecode eq 0 and revenue gt 1000000&$orderby=revenue desc&$top=5"
    ).then(
        function success(result){
            // retrieveMultipleRecords will return entity
            result.entities.forEach(function(account) {
                console.log("Account Name : %s", account.name)
                console.log("Telephone : %s", account.telephone1)
                console.log("Revenue : %s", account.revenue)
            })
        }, 
        function (error){
            console.log("Error : ", error.message)
        }
    )
}