// โจทย์ 3 — Required Level
// ใน Contact Form มี fields:
// firstname
// lastname
// emailaddress1
// telephone1
// เมื่อ preferredcontactmethodcode มีค่าเป็น:
// Email
// ให้ emailaddress1 เป็น Required
// ถ้าเป็น:
// Phone
// ให้ telephone1 เป็น Required
// และ field ที่ไม่ได้ใช้ต้องกลับเป็น Not Required

function RequiredContact_Onchange(executionContext){
    const formContext = executionContext.getFormContext()
    const preferredcontactmethodcode = formContext.getAttribute("preferredcontactmethodcode")
    const preferredcontactmethodcodeValue = preferredcontactmethodcode.getValue()
    // control
    const telephone1 = formContext.getAttribute("telephone1")
    const emailaddress1 = formContext.getAttribute("emailaddress1")
    if(preferredcontactmethodcodeValue === "Email"){
        telephone1.setRequiredLevel("none")
        emailaddress1.setRequiredLevel("required")
    }else if(preferredcontactmethodcodeValue === "Phone"){
        telephone1.setRequiredLevel("required")
        emailaddress1.setRequiredLevel("none")
    }else{
        telephone1.setRequiredLevel("none")
        emailaddress1.setRequiredLevel("none")
    }
}

// recommended this one cuz its shot and easy to edit 
function RequiredContact_OnChange(executionContext) {
    const formContext = executionContext.getFormContext();
    const method = formContext
        .getAttribute("preferredcontactmethodcode")
        .getValue();
    const telephone1 = formContext.getAttribute("telephone1");
    const emailaddress1 = formContext.getAttribute("emailaddress1");
    const config = {
        Email: {
            email: "required",
            phone: "none",
            sms: "none"
        },
        Phone: {
            email: "none",
            phone: "required",
            sms: "none",
        },
        // example add sms
        SMS : {
            email: "none",
            phone: "none",
            sms: "required"
        }
    };
    const setting = config[method] ?? {
        email: "none",
        phone: "none",
        sms: "none"
    };
    emailaddress1.setRequiredLevel(setting.email);
    telephone1.setRequiredLevel(setting.phone);
}