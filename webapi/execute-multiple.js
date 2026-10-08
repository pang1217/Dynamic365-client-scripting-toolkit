/*
 * Exercise 19: Execute Multiple Requests
 * Account Form:
 * When the user calls the function:
 * 1. Use Xrm.WebApi.online.executeMultiple()
 *    to send multiple requests
 *    within a single request.
 * 2. Create a Request for updating an Account.
 * 3. The Account to update:
 *    - Use the Account selected from the
 *      parentcustomerid lookup.
 * 4. Update the following data:
 *    - description = "Updated using Execute Multiple"
 * 5. When the execution is successful:
 *    - console.log the Account ID.
 *    - console.log("Success").
 * 6. If an API Error occurs:
 *    - console.log(error.message)
 *
 * Bonus:
 * - Update multiple Accounts in a single request.
 * - Check the response of each request.
 * - Use async / await.
 */

function executeMultiReq(executionContext) {
    const formContext = executionContext.getFormContext();
    const updateData = {
        "description": "Updated using Execute Multiple"
    };

    // Retrieve active accounts
    Xrm.WebApi.retrieveMultipleRecords(
        "account",
        "?$select=accountid&$filter=statecode eq 0"
    ).then(
        function success(result) {
            if (result.entities.length === 0) {
                console.log("No active accounts found to update.");
                return;
            }

            // Create an array to hold all batch requests
            const requests = [];
            // Populate the array with proper OData change request structures
            result.entities.forEach(function (account) {
                const req = {
                    etn: "account",
                    id: account.accountid.replace(/[{}]/g, ""),
                    payload: updateData,
                    getMetadata: function () {
                        return {
                            boundParameter: null,
                            parameterTypes: {},
                            operationType: 2, // 2 indicates a ChangeSet/Update operation
                            operationName: "Update"
                        };
                    }
                };
                requests.push(req);
            });

            // Execute the entire batch in a single network request
            Xrm.WebApi.online.executeMultiple(requests).then(
                function (response) {
                    console.log(`Successfully processed ${requests.length} records in batch.`);
                    // Optional: Parse individual response statuses if needed
                    response.forEach(function (res, index) {
                        console.log("Request " + index);
                        if (res.ok) {
                            console.log("Success");
                        } else {
                            console.log("Failed");
                        }
                    });
                },
                function (error) {
                    console.log("Execute Multiple Error: ", error.message);
                }
            );
        },
        function (error) {
            console.log("Retrieve Multiple Error: ", error.message);
        }
    );
}
