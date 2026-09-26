// โจทย์ 1 — Field Control
// ในหน้า Account Form ให้เขียน JavaScript เมื่อเปิด Form:
// เงื่อนไข
// ถ้า telephone1 มีค่า → ให้ field emailaddress1 เป็น Read Only
// ถ้า telephone1 ไม่มีค่า → ให้ emailaddress1 สามารถแก้ไขได้

function checkEmail_Onloads(executionContext){
    const formContext = executionContext.getFormContext()
    const telephone1 = formContext.getAttribute("telephone1")
    const telephone1Value = telephone1.getValue()
    const emailaddress1 = formContext.getControl("emailaddress1")
    emailaddress1.setDisabled(!!telephone1Value)
}