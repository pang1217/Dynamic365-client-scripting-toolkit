// โจทย์ 5 — อ่านค่า Lookup
// เมื่อ User เลือก:
// parentcustomerid
// ให้แสดงข้อมูลใน Console:
// Record ID
// Record Name
// Entity Type
// ตัวอย่างผลลัพธ์:
// ID: 8a12...
// Name: ABC Company
// Entity: account

function Read_Lookup(executionContext){
    const formContext = executionContext.getFormContext()
    const parentcustomerid = formContext.getAttribute("parentcustomerid").getValue()

    // recommend to add guarding cuz if user delete from lookup from getValue will be null
    if (!parentcustomerid || parentcustomerid.length === 0) {
        console.log("No customer selected")
        return
    }

    console.log("ID: %s", parentcustomerid[0].id)
    console.log("Name: %s", parentcustomerid[0].name)
    console.log("Entity: %s", parentcustomerid[0].entityType)
}