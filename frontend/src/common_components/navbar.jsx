import {useState,useEffect} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/PS-logo.png';
import '../css/navbar.css';

function NavBar({theme,setTheme}){
    const [mobileNav,setMobileNav]=useState(false);
    const [isLoggedIn,setIsLoggedIn]=useState(localStorage.getItem("isLoggedIn")==="true");
    const [userName,setUserName]=useState(localStorage.getItem("userName")||"");
    const navigate=useNavigate();

    useEffect(()=>{
        const syncAuthState=()=>{
            setIsLoggedIn(localStorage.getItem("isLoggedIn")==="true");
            setUserName(localStorage.getItem("userName")||"");
        };
        window.addEventListener("storage",syncAuthState);
        window.addEventListener("auth-change",syncAuthState);
        return()=>{
            window.removeEventListener("storage",syncAuthState);
            window.removeEventListener("auth-change",syncAuthState);
        };
    },[])

    function navigateUser(){
        if(isLoggedIn && userName){
            navigate(`/users/${userName}/browse`);
        }
        else{
            navigate("/login");
        }
        setMobileNav(false);
    }

    async function handleLogout(){
        try{
            await axios.post("http://localhost:5000/api/users/logout",{},{withCredentials:true});
        }
        catch(error){
            console.error("Logout error:", error);
        }
        finally{
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userName");
            window.dispatchEvent(new Event("auth-change"));
            navigate("/");
            setMobileNav(false);
        }
    }

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
        <div className={`navbar ${isLoggedIn ? 'navbar-logged-in' : ''}`}>
            <img src={logo} alt="Product-Store Logo" className="logo"/>
            <div className="nav-links">
                <div className="nav-items">
                    {!isLoggedIn && <Link to="/"><button className="home-btn"><i className="fa-solid fa-house-chimney"></i>Home</button></Link>}
                    {!isLoggedIn && <Link to="/about"><button className="about-btn"><i className="fa-solid fa-address-card"></i>About</button></Link>}
                    {!isLoggedIn && <button className="browse-btn" onClick={navigateUser}><i className="fa-solid fa-cart-shopping"></i>Browse</button>}
                    {!isLoggedIn && <button className="sell-btn" onClick={navigateUser}><i className="fa-solid fa-circle-check"></i>Sell</button>}
                </div>
            </div>
            <div className="user-setup">
                {
                    !isLoggedIn?(
                        <div className="theme-link">
                            <div className="toggle-action">
                                <button className="toggle-btn" onClick={toggleTheme}>{theme==="light"?<i className="fa-solid fa-moon"></i>:<i className="fa-solid fa-sun"></i>}</button>
                            </div>
                        </div>
                    ):(
                        <div className="add-link">
                            <div className="toggle-action">
                                <Link to={`/users/${userName}/addProduct`}><button className="add-product-btn"><i className="fa-solid fa-plus"></i><span className="add-label">Add Product</span></button></Link>
                            </div>
                        </div>
                    )
                }
                <div className="side-menu">
                    <div className="menu-action">
                        <button className="menu-btn" onClick={()=>setMobileNav(!mobileNav)}><i className="fa-solid fa-bars"></i></button>
                    </div>
                </div>
                <div className="user-links">
                    <div className="user-action">
                        {isLoggedIn && userName &&
                        <>
                            <Link to={`/users/${userName}/profile`}><button className="profile-btn">Profile</button></Link>
                            <Link to={`/users/${userName}/wishlist`}><button className="wishlist-btn">Wishlist</button></Link>
                            <Link to={`/users/${userName}/orders`}><button className="orders-btn">Orders</button></Link>
                            <Link to={`/users/${userName}/settings`}><button className="settings-btn">Settings</button></Link>
                        </>}
                        {!isLoggedIn &&
                        <>
                            <Link to="/signup"><button className="signup-btn">Sign Up</button></Link>
                            <Link to="/login"><button className="login-btn">Log In</button></Link>
                        </>}
                    </div>
                </div>
            </div>
        </div>
        <div className="mobile-nav">
            <div className={`mobile-nav-items ${mobileNav ? 'open' : 'closed'}`}>
                <Link to="/"><button className="mobile-home-btn" onClick={()=>setMobileNav(false)}><i className="fa-solid fa-house-chimney"></i>Home</button></Link>
                <Link to="/about"><button className="mobile-about-btn" onClick={()=>setMobileNav(false)}><i className="fa-solid fa-address-card"></i>About</button></Link>
                <button className="browse-btn" onClick={navigateUser}><i className="fa-solid fa-cart-shopping"></i>Browse</button>
                <button className="sell-btn" onClick={navigateUser}><i className="fa-solid fa-circle-check"></i>Sell</button>
                {isLoggedIn && userName && <Link to={`/users/${userName}/profile`}><button className="mobile-profile-btn" onClick={()=>setMobileNav(false)}><i className="fa-solid fa-user"></i>Profile</button></Link>}
                {isLoggedIn && userName && <Link to={`/users/${userName}/wishlist`}><button className="mobile-wishlist-btn" onClick={()=>setMobileNav(false)}><i className="fa-solid fa-heart"></i>Wishlist</button></Link>}
                {isLoggedIn && userName && <Link to={`/users/${userName}/orders`}><button className="mobile-orders-btn" onClick={()=>setMobileNav(false)}><i className="fa-solid fa-box"></i>Orders</button></Link>}
                {isLoggedIn && userName && <Link to={`/users/${userName}/settings`}><button className="mobile-settings-btn" onClick={()=>setMobileNav(false)}><i className="fa-solid fa-gear"></i>Settings</button></Link>}
                {!isLoggedIn && <Link to="/signup"><button className="mobile-signup-btn" onClick={()=>setMobileNav(false)}><i className="fa-solid fa-arrow-up-from-bracket"></i>Sign Up</button></Link>}
                {!isLoggedIn && <Link to="/login"><button className="mobile-login-btn" onClick={()=>setMobileNav(false)}><i className="fa-solid fa-right-to-bracket"></i>Sign In</button></Link>}
                {isLoggedIn && <button className="mobile-logout-btn" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>Logout</button>}
            </div>
        </div>
    </> 
    );
}

export default NavBar;