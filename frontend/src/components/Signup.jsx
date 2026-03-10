import {useState,useEffect,useRef} from "react";
import nav_menu from "../content/signup.js";
import {validateEmail,validatePhone} from "../../error_handlers/contact.js";
import axios from "axios";
import validator from "validator";
import { toast } from "react-hot-toast";
import "../css/signup.css";

function Signup(){
    const [contact,setContact]=useState("select");
    const [placeholder,setPlaceholder]=useState("Please select Email/Phone Number");

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
    const [inputContactError,setInputContactError]=useState("");
    const errorContact=useRef();
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
        try{
            const response=await axios.post("http://localhost:5000/api/users/signup",userData);
            toast.success(`${response.data.message}`,{className:"toast-success"});
        }
        catch(error){
            toast.error(`${error.response.data.message}`,{className:"toast-error"});
        }
    }

    useEffect(()=>{
        if(contact==="email"){
            setPlaceholder("Please Enter your Email");
        }
        else if(contact==="phone"){
            setPlaceholder("Please Enter your Phone Number");
        }
    },[contact]);

    useEffect(()=>{
        setFullAddress(`${addressNo}, ${city} - ${zip}`);
    },[addressNo,city,zip]);

    useEffect(()=>{
        setUserData({
            name:name,
            contact:contact==="email"?email:phone,
            password:password,
            address:fullAddress,
            consent:checkBox
        });
    },[name,phone,email,password,fullAddress,checkBox]);

    useEffect(()=>{
        if(!users_list.length || contact==="select") return;
        if(contact==="email"){
            if(!validator.isEmail(email)){
                errorContact.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
            }
            else{
                const result=validateEmail(email,users_list);
                if(result.valid===false){
                    errorContact.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
                    setInputContactError(result.message);
                }
                else{
                    errorContact.current.style.borderColor="var(--background_color_tertiary)";
                    setInputContactError("");
                }
            }
        }
        else if(contact==="phone"){
            const result=validatePhone(phone,users_list);
            if(!result.valid){
                errorContact.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
                setInputContactError(result.message);
            }
            else{
                errorContact.current.style.borderColor="var(--background_color_tertiary)";
                setInputContactError("");
            }
        }
    },[phone,email,contact,users_list]);

    useEffect(()=>{
        if(contact==="select"){
            errorContact.current.style.visibility="hidden";
        }
        else{
            errorContact.current.style.visibility="visible";
        }
    },[contact])


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
                <form className="signup-form" onSubmit={(event)=>event.preventDefault()}>
                <h3>Personal Details</h3>
                <section id="personal">
                    <label htmlFor="name">Name</label>
                    <input  id="name" 
                            type="text" 
                            placeholder="Name" 
                            value={name}
                            onChange={(event)=>setName(event.target.value)}
                            required/>
                    <label htmlFor="choice">Choose Email/Phone Number</label>
                    <div className="email-phone">
                        <select id="choice" 
                                name="choice" 
                                value={contact}
                                onChange={(event)=>setContact(event.target.value)}>
                            <option value="select">--Select--</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone Number</option>
                        </select>
                        <div className="input-contact">
                            <input  id="sel-choice" 
                                    type={contact==="email"?"email":"tel"} 
                                    placeholder={placeholder} 
                                    value={contact==="email"?email:phone}
                                    onChange={(event)=>contact==="email"?setEmail(event.target.value):setPhone(event.target.value)}
                                    ref={errorContact}
                                    required/>
                            <p>{inputContactError}</p>
                        </div>
                    </div>
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
                    <label htmlFor="password">Confirm Password</label>
                    <input  id="password" 
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
                    className="submit-btn"
                    onClick={SignUp}>Sign Up</button>
            </div>
        </div>
    );
}

export default Signup;