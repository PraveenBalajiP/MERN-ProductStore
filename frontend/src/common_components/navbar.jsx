import {useState} from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/PS-logo.png';
import '../css/navbar.css';

function NavBar({theme,setTheme}){
    const [mobileNav,setMobileNav]=useState(false);

    function toggleTheme(){
        if(theme==="light"){
            setTheme("dark")
            localStorage.setItem("theme","dark");
        }
        else{
            setTheme("light")
            localStorage.setItem("theme","light");
        }
    }

    return(
        <>
        <div className="navbar">
            <img src={logo} alt="Product-Store Logo" className="logo"/>
            <div className="nav-links">
                <div className="nav-items">
                    <Link to="/"><button className="home-btn"><i class="fa-solid fa-house-chimney"></i>Home</button></Link>
                    <Link to="/about"><button className="about-btn"><i class="fa-solid fa-address-card"></i>About</button></Link>
                    <Link to="/browse"><button className="browse-btn"><i class="fa-solid fa-cart-shopping"></i>Browse</button></Link>
                    <Link to="/sell"><button className="sell-btn"><i class="fa-solid fa-circle-check"></i>Sell</button></Link>
                </div>
            </div>
            <div className="user-setup">
                <div className="theme-link">
                    <div className="toggle-action">
                        <button className="toggle-btn" onClick={toggleTheme}>{theme==="light"?<i class="fa-solid fa-moon"></i>:<i class="fa-solid fa-sun"></i>}</button>
                    </div>
                </div>
                <div className="side-menu">
                    <div className="menu-action">
                        <button className="menu-btn" onClick={()=>setMobileNav(!mobileNav)}><i class="fa-solid fa-bars"></i></button>
                    </div>
                </div>
                <div className="user-links">
                    <div className="user-action">
                        <button className="signup-btn">Sign Up</button>
                        <button className="login-btn">Log In</button>
                    </div>
                </div>
            </div>
        </div>
        {mobileNav && 
        <div className="mobile-nav">
            <div className="mobile-nav-items" >
                <Link to="/"><button className="mobile-home-btn"><i class="fa-solid fa-house-chimney"></i>Home</button></Link>
                <Link to="/about"><button className="mobile-about-btn"><i class="fa-solid fa-address-card"></i>About</button></Link>
                <Link to="/browse"><button className="mobile-browse-btn"><i class="fa-solid fa-cart-shopping"></i>Browse</button></Link>
                <Link to="/sell"><button className="mobile-sell-btn"><i class="fa-solid fa-circle-check"></i>Sell</button></Link>
                <Link to="/signup"><button className="mobile-signup-btn"><i class="fa-solid fa-arrow-up-from-bracket"></i>Sign Up</button></Link>
                <Link to="/signin"><button className="mobile-login-btn"><i class="fa-solid fa-right-to-bracket"></i>Sign In</button></Link>
            </div>
        </div>}
    </> 
    );
}

export default NavBar;