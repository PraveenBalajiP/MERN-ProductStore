import {useState,useEffect} from "react";
import {useNavigate,Link,Outlet,useParams} from "react-router-dom";
import axios from "axios";
import "../css/user.css";

function User(){
    const [sideBoardOpen,setSideBoardOpen]=useState(false);
    const navigate=useNavigate();
    const {name}=useParams();
    const userName=name || localStorage.getItem("userName")||"";

    useEffect(()=>{
        async function checkAuth(){
            if(localStorage.getItem("isLoggedIn")!=="true" || !userName){
                navigate("/login");
                return;
            }
            try{
                await axios.get("http://localhost:5000/api/users/check-auth",{withCredentials:true});
            }
            catch(error){
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userName");
                window.dispatchEvent(new Event("auth-change"));
                navigate("/login");
            }
        }
        checkAuth();
    },[navigate,userName])

    async function handleLogout(){
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        window.dispatchEvent(new Event("auth-change"));
        await axios.post("http://localhost:5000/api/users/logout",{},{withCredentials:true});
        navigate("/");
    }

    return(
        <>
            <button className={`hamburger ${sideBoardOpen ? 'open' : 'closed'}`}
                    onClick={()=>setSideBoardOpen(!sideBoardOpen)}>
                    {sideBoardOpen?
                        <i className="fa-solid fa-xmark"></i>:
                        <i className="fa-solid fa-bars"></i>}
            </button>
            <div className={`side-board ${sideBoardOpen ? 'open' : 'closed'}`}>
                <Link to={`/users/${userName}/profile`}><button className="profile-btn"><i className="fa-solid fa-user"></i>Profile</button></Link>
                <Link to={`/users/${userName}/wishlist`}><button className="wishlist-btn"><i className="fa-solid fa-heart"></i>Wishlist</button></Link>
                <Link to={`/users/${userName}/orders`}><button className="orders-btn"><i className="fa-solid fa-box"></i>Orders</button></Link>
                <Link to={`/users/${userName}/settings`}><button className="settings-btn"><i className="fa-solid fa-gear"></i>Settings</button></Link>
                <button className="logout-btn" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>Logout</button>
            </div>
            <div className="user-content">
                <Outlet />
            </div>
        </>
    );
}

export default User;