// Exercise 3 — Required Level
// In the Contact Form, there are the following fields:
// firstname
// lastname
// emailaddress1
// telephone1

// When preferredcontactmethodcode has the following values:
// Email → Set emailaddress1 to Required.
// Phone → Set telephone1 to Required.
// The field that is not being used must be changed back to Not Required.

//solution1
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

//solution2
// recommended this one cuz its shot and easy to edit when u want to add new contact channel
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