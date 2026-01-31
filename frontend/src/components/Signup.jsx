import {useState,useEffect,useRef} from "react";
import "../css/signup.css";

function Signup(){
    const [contact,setContact]=useState("select");
    const [placeholder,setPlaceholder]=useState("Please select Email/Phone Number");

    useEffect(()=>{
        if(contact==="email"){
            setPlaceholder("Please Enter your Email");
        }
        else if(contact==="phone"){
            setPlaceholder("Please Enter your Phone Number");
        }
    },[contact]);

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
                    <label for="name">Name</label>
                    <input id="name" type="text" placeholder="Name" required/>
                    <label for="choice">Choose Email/Phone Number</label>
                    <div className="email-phone">
                        <select id="choice" name="choice" onChange={(event)=>setContact(event.target.value)}>
                            <option value="select" selected>--Select--</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone Number</option>
                        </select>
                        <input id="sel_choice" type={contact==="email"?"email":"tel"} placeholder={placeholder} required/>
                    </div>
                </section>
                <h3>Security</h3>
                <section id="security">
                    <label for="password">Password</label>
                    <input id="password" type="password" placeholder="Confirm Password" required/>
                </section>
                <h3>Location</h3>
                <section id="location">
                    <label for="address">Address</label>
                    <input id="address" type="text" placeholder="Address" required/>
                    <label for="city">City</label>
                    <input id="city" type="text" placeholder="City" required/>
                    <label for="zip">ZIP Code</label>
                    <input id="zip" type="text" placeholder="ZIP Code" required/>
                </section>
                <h3>Consent</h3>
                <section id="consent">
                    <label>
                        <input type="checkbox" required/>
                        I agree to the Terms and Conditions
                    </label>
                </section>
            </form>
            <button type="submit" className="submit-btn">Sign Up</button>
            </div>
        </div>
    );
}

export default Signup;