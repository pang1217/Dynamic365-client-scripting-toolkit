// Exercise 2 — OnChange
// When the user changes the value of industrycode, perform the following actions:
// Industry	Action :
// Manufacturing -->	Show the description field
// Finance	     -->    Show the description field
// Others	     -->    Hide the description field


//solution
const IndustryCode_ShowDes = ["Manufacturing", "Finance"]

function IndustryCode_OnChange(executionContext){
    const formContext = executionContext.getFormContext()
    const industrycode = formContext.getAttribute("industrycode")
    const industrycodeValue = industrycode.getValue()
    const description = formContext.getControl("description")
    description.setVisible(IndustryCode_ShowDes.includes(industrycodeValue))
}