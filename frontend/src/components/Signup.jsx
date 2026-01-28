import "../css/signup.css";

function Signup(){
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
                    <div className="nav-item" key={item.name}>
                        <a href={item.link} className="nav-item" key={item.name}>
                            {item.name}
                        </a>
                    </div>
                ))}
            </div>  
            <form className="signup-form">
                <section id="personal">
                    <label for="name">Name</label>
                    <input id="name" type="text" placeholder="Name" required/>
                    <label for="choice">Choose Email/Phone Number</label>
                    <select id="choice" name="choice">
                        <option value="select" selected>--Select--</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone Number</option>
                    </select>
                    <label for="sel_choice">{}</label>
                    <input id="sel_choice" type="email" placeholder="hello" required/>`
                </section>
                <section id="security">
                    <label for="security-question">Security Question</label>
                    <select id="security-question" name="security-question">
                        <option value="select" selected>--Select a question--</option>
                        <option value="pet-name">What is your pet's name?</option>
                        <option value="birth-city">In which city were you born?</option>
                        <option value="mother-maiden">What is your mother's maiden name?</option>
                    </select>
                    <label for="security-answer">Your Answer</label>
                    <input id="security-answer" type="text" placeholder="Answer" required/>
                    <label for="password">Password</label>
                    <input id="password" type="password" placeholder="Confirm Password" required/>
                </section>
                <section id="location">
                    <label for="address">Address</label>
                    <input id="address" type="text" placeholder="Address" required/>
                    <label for="city">City</label>
                    <input id="city" type="text" placeholder="City" required/>
                    <label for="zip">ZIP Code</label>
                    <input id="zip" type="text" placeholder="ZIP Code" required/>
                </section>
                <section id="consent">
                    <label>
                        <input type="checkbox" required/>
                        I agree to the Terms and Conditions
                    </label>
                </section>
            </form>
        </div>
    );
}

export default Signup;