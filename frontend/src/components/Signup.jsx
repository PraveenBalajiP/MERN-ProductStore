import {useState,useEffect,useRef} from "react";
import nav_menu from "../content/signup.js";
import {validateEmail,validatePhone} from "../../error_handlers/contact.js";
import axios from "axios";
import validator from "validator";
import { toast } from "react-hot-toast";
import "../css/signup.css";

function Signup(){
    const [name,setName]=useState("");
    const [phone,setPhone]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [addressNo,setAddressNo]=useState("");
    const [city,setCity]=useState("");
    const [zip,setZip]=useState("");
    const [fullAddress,setFullAddress]=useState("");
    const [checkBox,setCheckBox]=useState(false);
    const [userData,setUserData]=useState({});

    const [users_list,setUsersList]=useState([]);
    const [passwordError,setPasswordError]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [matchedPassword,setMatchedPassword]=useState(false);
    const [confirmPasswordError,setConfirmPasswordError]=useState("");
    const [emailError,setEmailError]=useState("");
    const [phoneError,setPhoneError]=useState("");
    const emailRef=useRef();
    const phoneRef=useRef();
    const password_Error=useRef();
    const confirmPassword_Error=useRef();

    useEffect(()=>{
        async function users(){
        try{
            const response=await axios.get("http://localhost:5000/api/users/signup");
            setUsersList(response.data);
        }
        catch(error){
            console.error("Error fetching users:", error);
            }
        }
        users();
    },[])

    async function SignUp(){
        const trimmedEmail=email.trim();
        const trimmedPhone=phone.trim();

        if(!trimmedEmail || !trimmedPhone){
            toast.error("Email and phone number are required",{className:"toast-error"});
            return;
        }
        if(!validator.isEmail(trimmedEmail)){
            toast.error("Please enter a valid email",{className:"toast-error"});
            return;
        }
        const phoneValidation=validatePhone(trimmedPhone,users_list);
        if(!phoneValidation.valid){
            toast.error(phoneValidation.message,{className:"toast-error"});
            return;
        }
        if(passwordError || confirmPasswordError || !matchedPassword){
            toast.error("Please fix password validation errors",{className:"toast-error"});
            return;
        }

        try{
            const response=await axios.post("http://localhost:5000/api/users/signup",{
                ...userData,
                email:trimmedEmail,
                phone:trimmedPhone
            });
            toast.success(`${response.data.message}`,{className:"toast-success"});
        }
        catch(error){
            toast.error(`${error?.response?.data?.message || "Signup failed"}`,{className:"toast-error"});
        }
    }

    useEffect(()=>{
        setFullAddress(`${addressNo}, ${city} - ${zip}`);
    },[addressNo,city,zip]);

    useEffect(()=>{
        setUserData({
            name:name,
            email:email,
            phone:phone,
            password:password,
            address:fullAddress,
            consent:checkBox
        });
    },[name,phone,email,password,fullAddress,checkBox]);

    useEffect(()=>{
        if(!emailRef.current) return;

        const trimmedEmail=email.trim();
        if(trimmedEmail.length===0){
            emailRef.current.style.borderColor="var(--border_color)";
            setEmailError("");
            return;
        }

        if(!validator.isEmail(trimmedEmail)){
            emailRef.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
            setEmailError("Invalid email format");
            return;
        }

        const result=validateEmail(trimmedEmail,users_list);
        if(result.valid===false){
            emailRef.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
            setEmailError(result.message);
        }
        else{
            emailRef.current.style.borderColor="var(--border_color)";
            setEmailError("");
        }
    },[email,users_list]);

    useEffect(()=>{
        if(!phoneRef.current) return;

        const trimmedPhone=phone.trim();
        if(trimmedPhone.length===0){
            phoneRef.current.style.borderColor="var(--border_color)";
            setPhoneError("");
            return;
        }

        const result=validatePhone(trimmedPhone,users_list);
        if(!result.valid){
            phoneRef.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
            setPhoneError(result.message);
        }
        else{
            phoneRef.current.style.borderColor="var(--border_color)";
            setPhoneError("");
        }
    },[phone,users_list]);


    useEffect(()=>{
        if(password.length===0){
            setPasswordError("");
            password_Error.current.style.borderColor="var(--background_color_tertiary)";
        }
        else if(password.length<6){
            setPasswordError("Password must be at least 6 characters long.");
            password_Error.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
        }
        else if(!/[A-Z]/.test(password)){
            setPasswordError("Password must contain at least one uppercase letter.");
            password_Error.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
        }
        else if(!/[a-z]/.test(password)){
            setPasswordError("Password must contain at least one lowercase letter.");
            password_Error.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
        }
        else if(!/[0-9]/.test(password)){
            setPasswordError("Password must contain at least one digit.");
            password_Error.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
        }
        else if(!/[!@#$%^&*]/.test(password) ){
            setPasswordError("Password must contain at least one special character (!@#$%^&*).");
            password_Error.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
        }
        else{
            setPasswordError("");
            password_Error.current.style.borderColor="var(--background_color_tertiary)";
        }
    },[password])

    useEffect(()=>{
        if(!confirmPassword){
            setConfirmPasswordError("");
            confirmPassword_Error.current.style.borderColor="var(--background_color_tertiary)";
            return;
        }
        if(password==confirmPassword){
            setMatchedPassword(true);
            setConfirmPasswordError("");
            confirmPassword_Error.current.style.borderColor="var(--background_color_tertiary)";
            confirmPassword_Error.current.style.borderColor="var(--background_color_tertiary)";
        }
        else{
            setMatchedPassword(false);
            setConfirmPasswordError("Passwords do not match.");
            confirmPassword_Error.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
        }
    },[password,confirmPassword])

    return(
        <div className="signup-page">
            <h2>Sign Up</h2>
            <div className="nav">
                {nav_menu.map((item)=>(
                    <a href={item.link} className="nav-item" key={item.name}>
                        {item.name}
                    </a>
                ))}
            </div>  
            <div className="form">
                <form id="signup-form" className="signup-form" onSubmit={(event)=>{event.preventDefault(); SignUp();}}>
                <h3>Personal Details</h3>
                <section id="personal">
                    <label htmlFor="name">Name</label>
                    <input  id="name" 
                            type="text" 
                            placeholder="Name" 
                            value={name}
                            onChange={(event)=>setName(event.target.value)}
                            required/>
                    <label htmlFor="email">Email</label>
                    <input id="email" 
                           type="text" 
                           placeholder="Enter your Email" 
                           value={email}
                           onChange={(event)=>setEmail(event.target.value)}
                           ref={emailRef}
                           required/>
                    <p className="error-message">{emailError}</p>
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" 
                           type="text" 
                           placeholder="Enter your Phone Number (10 digits)" 
                           value={phone}
                           onChange={(event)=>setPhone(event.target.value)}
                           ref={phoneRef}
                           required/>
                    <p className="error-message">{phoneError}</p>
                </section>
                <h3>Security</h3>
                <section id="security">
                    <label htmlFor="password">Password</label>
                    <input  id="password" 
                            type="password" 
                            placeholder="Enter Password"
                            value={password}
                            onChange={(event)=>setPassword(event.target.value)}
                            ref={password_Error}
                            required/>
                    <span className="error-password">{passwordError}</span>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input  id="confirmPassword" 
                            type="password" 
                            placeholder="Enter Password Again to Confirm" 
                            value={confirmPassword}
                            onChange={(event)=>setConfirmPassword(event.target.value)}
                            ref={confirmPassword_Error}
                            required/>
                    <span className="confirm-error-password">{confirmPasswordError}</span>
                </section>
                <h3>Location</h3>
                <section id="location">
                    <label htmlFor="address">Address</label>
                    <input  id="address" 
                            type="text" 
                            placeholder="Address" 
                            value={addressNo}
                            onChange={(event)=>setAddressNo(event.target.value)}
                            required/>
                    <label htmlFor="city">City</label>
                    <input  id="city" 
                            type="text" 
                            placeholder="City" 
                            value={city}
                            onChange={(event)=>setCity(event.target.value)}
                            required/>
                    <label htmlFor="zip">ZIP Code</label>
                    <input id="zip" 
                           type="text" 
                           placeholder="ZIP Code" 
                           value={zip}
                           onChange={(event)=>setZip(event.target.value)}
                           required/>
                </section>
                <h3>Consent</h3>
                <section id="consent">
                    <label>
                        <input  type="checkbox" 
                                checked={checkBox}
                                onChange={(event)=>setCheckBox(event.target.checked)}
                                required/>
                        I agree to the Terms and Conditions
                    </label>
                </section>
            </form>
                <button type="submit" 
                    form="signup-form"
                    className="submit-btn"
                    >Sign Up</button>
            </div>
        </div>
    );
}

export default Signup;