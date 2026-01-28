function Signup(){
    return(
        <div className="signup-page">
            <h2>Sign Up</h2>
            <form className="signup-form">
                <input type="text" placeholder="Username" required/>
                <input type="email" placeholder="Email" required/>
                <input type="password" placeholder="Password" required/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Signup;