/*
 * Exercise 20: Execute Multiple + Create Records
 * Account Form:
 * When the user calls the function:
 * 1. Use Xrm.WebApi.retrieveMultipleRecords()
 *    to retrieve Active Accounts.
 * 2. The query must:
 *    - Return only Active Accounts.
 *    - Retrieve the Account Name.
 *    - Limit the number of Accounts to retrieve.
 * 3. For each Account:
 *    - Create a new Task.
 * 4. The Task must contain:
 *    - subject = "Follow up with Customer"
 *    - description = "Created using Execute Multiple"
 *    - regarding = the Account currently being processed.
 * 5. Use Xrm.WebApi.online.executeMultiple()
 *    to create multiple Tasks within a single request.
 * 6. Use a Request Object for the Create operation:
 *    - entityName
 *    - payload
 *    - getMetadata()
 * 7. When the execution is successful:
 *    - console.log the number of Tasks submitted.
 *    - Check the response of each request.
 *    - console.log Success / Failed for each request.
 * 8. If no Active Accounts are found:
 *    - console.log("No active accounts found.")
 * 9. If an API Error occurs:
 *    - console.log(error.message)
 *
 * Bonus:
 * - Use async / await.
 * - Add $orderby.
 * - Add $top.
 * - Display the Account Name before creating the Task.
 * - Display the number of successfully created Tasks.
 * - Display the number of failed Tasks.
 *
 * Goal:
 * - Understand the difference between
 *   Update Request and Create Request.
 * - Practice creating multiple Related Records
 *   using executeMultiple().
 */

async function processAccountFollowUps(executionContext) {
    try {
        // Retrieve Active Accounts with filters, limits (top), and sorting (orderby)
        // Bonus: Limit to top 50 for batch safety, order alphabetically by name
        const query = "?\$select=name,accountid" +
                      "&\$filter=statecode eq 0" +
                      "&\$orderby=name asc" +
                      "&\$top=50";

        console.log("Retrieving active accounts...");
        const result = await Xrm.WebApi.retrieveMultipleRecords("account", query);

        // If no Active Accounts are found
        if (!result || result.entities.length === 0) {
            console.log("No active accounts found.");
            return;
        }

        // Build the Request Objects array for the Create operation
        const batchRequests = result.entities.map(function (account) {
            const accountId = account.accountid.replace(/[{}]/g, "");
            
            // Bonus: Display the Account Name before creating the Task
            console.log(`Preparing task for Account: ${account.name}`);

            // Task structural payload definition
            return {
                etn: "task", // entityName parameter (Dataverse client API uses 'etn')
                payload: {
                    "subject": "Follow up with Customer",
                    "description": "Created using Execute Multiple",
                    // Bind polymorphic 'regardingobjectid' lookup to the active Account
                    "regardingobjectid_account_task@odata.bind": `/accounts(${accountId})`
                },
                getMetadata: function () {
                    return {
                        boundParameter: null,
                        parameterTypes: {},
                        operationType: 2,       // CRUD Operation
                        operationName: "Create" // Specifies the creation request type
                    };
                }
            };
        });

        // Console.log the total number of Tasks submitted to the batch
        console.log(`Submitting batch execution for ${batchRequests.length} Tasks...`);

        // Use Xrm.WebApi.online.executeMultiple() to execute requests in a single payload
        const responses = await Xrm.WebApi.online.executeMultiple(batchRequests);

        // Summary counters initialized (Bonus)
        let successCount = 0;
        let failedCount = 0;

        // Check the response of each request
        responses.forEach(function (response, index) {
            if (response.ok) {
                successCount++;
                console.log(`Request #${index + 1}: Success`);
            } else {
                failedCount++;
                console.log(`Request #${index + 1}: Failed - Status: ${response.statusText}`);
            }
        });

        // Bonus: Display ultimate execution summary results
        console.log(`--- Execution Summary ---`);
        console.log(`Total successfully created Tasks: ${successCount}`);
        console.log(`Total failed Tasks: ${failedCount}`);

    } catch (error) {
        // If any API or runtime Error occurs
        console.log("An error occurred: " + error.message);
    }
}