import {useState,useEffect} from "react";
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
    
    const nav_menu=[
        {name:"Personal Details",link:"#personal"},
        {name:"Security",link:"#security"},
        {name:"Location",link:"#location"},
        {name:"Consent",link:"#consent"},
    ]

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
                <form className="signup-form">
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
                        <select id="choice" name="choice" onChange={(event)=>setContact(event.target.value)}>
                            <option value="select" selected>--Select--</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone Number</option>
                        </select>
                        <input  id="sel_choice" 
                                type={contact==="email"?"email":"tel"} 
                                placeholder={placeholder} 
                                value={contact==="email"?email:phone}
                                onChange={(event)=>contact==="email"?setEmail(event.target.value):setPhone(event.target.value)}
                                required/>
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
                            required/>
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
                    className="submit-btn">Sign Up</button>
            </div>
        </div>
    );
}

export default Signup;