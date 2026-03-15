import{useState,useEffect,useRef}from"react";
import axios from"axios";
import { toast } from "react-hot-toast";
import validator from "validator"
import {useNavigate} from "react-router-dom";
import"../css/login.css";

function Login(){
    const[contact,setContact]=useState("select");
    const[placeholder,setPlaceholder]=useState("Select");

    const [phone,setPhone]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [userData,setUserData]=useState({});

    const displayRef=useRef();

    const navigate=useNavigate();

    useEffect(()=>{
        setUserData({
            contact:contact==="email"?email:phone,
            password:password
        })
    },[phone,email,password,contact]);

    useEffect(()=>{
        if(contact==="email"){
            setPlaceholder("Please Enter your Email");
        }
        else if(contact==="phone"){
            setPlaceholder("Please Enter your Phone Number");
        }
    },[contact])

    useEffect(()=>{
        if(contact==="select"){
            displayRef.current.style.visibility="hidden";
        }
        else{
            displayRef.current.style.visibility="visible";
        }
    },[contact])

    const handleChange=(e)=>{
        const v=e.target.value;
        setContact(v);
        if(v==="email")setPlaceholder("Please Enter your Email");
        else if(v==="phone")setPlaceholder("Please Enter your Phone Number");
        else setPlaceholder("Please select Email/Phone Number");
    };

    useEffect(()=>{
        if(contact==="email"){
            if(!validator.isEmail(email))
                displayRef.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
            else
                displayRef.current.style.borderColor="var(--background_color_tertiary)";
        }
        else if(contact==="phone"){
            if(!validator.isMobilePhone(phone,"any")){
                displayRef.current.style.borderColor="hsla(0, 77%, 58%, 0.753)";
            }
            else{
                displayRef.current.style.borderColor="var(--background_color_tertiary)";
            }
        }
    },[email,phone,contact])

    async function handleLogin(){
        if (contact==="select"){
            toast.error("Please choose Email or Phone",{className:"toast-error"});
            return;
        }
        try {
            const response=await axios.post("http://localhost:5000/api/users/login",userData,{withCredentials:true});
            toast.success(`${response.data.message}`,{className:"toast-success"});
            localStorage.setItem("isLoggedIn","true");
            localStorage.setItem("userName",response.data.name);
            window.dispatchEvent(new Event("auth-change"));
            navigate(`/users/${response.data.name}`);
        }
        catch(error){
            toast.error("Error!!",{className:"toast-error"});
        }
    }

    return(
        <div className="login-page">
            <h2>Login</h2>
            <div className="form">
                <form className="login-form" onSubmit={(event)=>event.preventDefault()}>
                    <section>
                        <label htmlFor="choice">Choose Email/Phone Number</label>
                        <div className="email-phone">
                            <select id="choice" onChange={handleChange}>
                                <option value="select">--Select--</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone Number</option>
                            </select>
                            <input  id="sel_choice" 
                                    type={contact==="email"?"email":"tel"} 
                                    placeholder={placeholder} 
                                    value={contact==="email"?email:phone}
                                    onChange={(event)=>contact==="email"?setEmail(event.target.value):setPhone(event.target.value)}
                                    ref={displayRef}
                                    required/>
                        </div>
                        <label htmlFor="password">Password</label>
                        <input  id="password" 
                                type="password" 
                                placeholder="Enter Password" 
                                value={password}
                                onChange={(event)=>setPassword(event.target.value)}
                                required/>
                        <button type="submit" 
                                className="submit-btn"
                                onClick={handleLogin}>Login</button>
                        <p className="switch-link">Don’t have an account? <a href="/signup">Sign Up</a></p>
                    </section>
                </form>
            </div>
        </div>
    );
    }

export default Login;