// โจทย์ 8 — Web API + Lookup
// ใน Contact Form:
// parentcustomerid
// เมื่อ User เลือก Account:
// ใช้ Account ID
// retrieveRecord
// ดึง telephone1
// เอาเบอร์โทรไปใส่ใน Contact:
// telephone1
// ถ้า Account ไม่มีเบอร์ → Clear telephone1
// ถ้า API Error → แสดง Form Notification
// Flow:
// Lookup Change
//       ↓
// Get Account ID
//       ↓
// Xrm.WebApi.retrieveRecord()
//       ↓
// Get telephone1
//       ↓
// Set Contact telephone1


function SetContact_onChange(executionContext){
    const formContext = executionContext.getFormContext()
    
}