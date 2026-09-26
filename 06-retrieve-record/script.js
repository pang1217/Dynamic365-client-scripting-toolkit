// โจทย์ 6 — Retrieve Record
// เมื่อเปิด Contact Form ให้ใช้:
// parentcustomerid
// หา Account ที่เกี่ยวข้องด้วย Xrm.WebApi.retrieveRecord()
// แล้วดึง:
// name
// telephone1
// websiteurl
// ออกมาแสดงใน Console
// ต้อง handle ด้วยว่า
// parentcustomerid ไม่มีค่า
// API Error


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