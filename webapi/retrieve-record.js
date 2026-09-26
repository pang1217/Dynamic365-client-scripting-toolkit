/*
Exercise 6 — Retrieve Record
When the Contact Form is opened:
Use the parentcustomerid lookup field.
Retrieve the related Account using Xrm.WebApi.retrieveRecord().

Then retrieve and display the following information in the Console:
name
telephone1
websiteurl

Error Handling:
Handle the case where parentcustomerid has no value.
Handle API errors appropriately.
*/

// solution
function RetriveRecord(executionContext){
    const formContext = executionContext.getFormContext()
    const parentcustomerid = formContext.getAttribute("parentcustomerid").getValue()

    // parentcustomerid is a lookup so checkthis before use [0]
    if (!parentcustomerid || parentcustomerid.length === 0) {
        console.log("parentcustomerid ไม่มีค่า")
        return
    }
    Xrm.WebApi.retrieveRecord(
        "account", 
        parentcustomerid[0].id, 
        "?$select=name,telephone1,websiteurl"
    ).then(
        // if api error or not found will fallback to error automatic
        function success(result){
            console.log("name : %s", result.name)
            console.log("telephone1 : %s", result.telephone1)
            console.log("websiteurl : %s", result.websiteurl)
        }, 
        function (error){
            console.log("API Error : ", error.message)
        }
    )
}