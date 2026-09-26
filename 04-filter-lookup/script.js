/*
โจทย์ 4 — Filter Lookup
ใน Contact Form มี Lookup:
parentcustomerid
ต้องการให้ User สามารถเลือกเฉพาะ Active Account
ห้ามแสดง Contact ใน Lookup
*/

function ListContact_OnLoad(executionContext){
    const formContext = executionContext.getFormContext()
    const control = formContext.getControl("parentcustomerid")
    control.addPreSearch(function (){filterAccount(control)})
    // VVVV สามารถเขียนแบบนี้ได้เหมือนกัน
    // control.addPreSearch(() => filterAccount(control));
}

function filterAccount(control){
    var customerAccountFilter = "<filter type='and'><condition attribute='statecode' operator='eq' value='0'/></filter>";
    control.addCustomFilter(customerAccountFilter, "account");
}