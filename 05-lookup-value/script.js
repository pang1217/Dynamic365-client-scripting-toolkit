/*
Exercise 5 — Read Lookup Value
When the user selects a value in the parentcustomerid lookup field, display the following information in the Console:
Record ID
Record Name
Entity Type

Example Output:
ID: 8a12...
Name: ABC Company
Entity: account
*/

// Solution
function Read_Lookup(executionContext){
    const formContext = executionContext.getFormContext()
    const parentcustomerid = formContext.getAttribute("parentcustomerid").getValue()

    // recommend to add guarding cuz if user delete value from lookup getValue will be null or empty
    if (!parentcustomerid || parentcustomerid.length === 0) {
        console.log("No customer selected")
        return
    }

    console.log("ID: %s", parentcustomerid[0].id)
    console.log("Name: %s", parentcustomerid[0].name)
    console.log("Entity: %s", parentcustomerid[0].entityType)
}