// โจทย์ 2 — OnChange
// เมื่อ User เปลี่ยนค่า industrycode
// ให้ทำงานดังนี้:
// Industry	Action : field
// Manufacturing	แสดง description
// Finance	แสดง description
// อื่น ๆ	ซ่อน description


const IndustryCode_ShowDes = ["Manufacturing", "Finance"]
function IndustryCode_OnChange(executionContext){
    const formContext = executionContext.getFormContext()
    const industrycode = formContext.getAttribute("industrycode")
    const industrycodeValue = industrycode.getValue()
    const description = formContext.getControl("description")
    description.setVisible(IndustryCode_ShowDes.includes(industrycodeValue))
}