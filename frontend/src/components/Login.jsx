import{useState,useEffect}from"react";
import"../css/login.css";

function Login(){
    const[contact,setContact]=useState("select");
    const[placeholder,setPlaceholder]=useState("Please select Email/Phone Number");

    const [phone,setPhone]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [userData,setUserData]=useState({});

    useEffect(()=>{
        setUserData({
            contact:contact==="email"?email:phone,
            password:password
        })
    },[phone,email,password]);

    const handleChange=(e)=>{
        const v=e.target.value;
        setContact(v);
        if(v==="email")setPlaceholder("Please Enter your Email");
        else if(v==="phone")setPlaceholder("Please Enter your Phone Number");
        else setPlaceholder("Please select Email/Phone Number");
    };

    return(
        <div className="login-page">
            <h2>Login</h2>
            <div className="form">
                <form className="login-form">
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
                                    required/>
                        </div>
                        <label htmlFor="password">Password</label>
                        <input  id="password" 
                                type="password" 
                                placeholder="Enter Password" 
                                value={password}
                                onChange={(event)=>setPassword(event.target.value)}
                                required/>
                        <button type="submit" className="submit-btn">Login</button>
                        <p className="switch-link">Don’t have an account? <a href="/signup">Sign Up</a></p>
                    </section>
                </form>
            </div>
        </div>
    );
    }

export default Login;