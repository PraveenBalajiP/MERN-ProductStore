function validateEmail(email,users){
    if(users.find(user=>user.email===email || user.contact===email)){
        return {message:"Email already in use",valid:false};
    }
    return {message:"Valid email",valid:true};
}

function validatePhone(phone,users){    
    if(users.find(user=>user.phone===phone || user.contact===phone)){
        return {message:"Phone number already in use",valid:false};
    }
    if(phone.length!==10 || isNaN(phone)){
        return {message:"Invalid phone number",valid:false};
    }
    else
        return {message:"Valid phone number",valid:true};
}

export {validateEmail,validatePhone};