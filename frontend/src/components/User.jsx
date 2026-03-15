import {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../css/user.css";

function User(){
    const [sideBoardOpen,setSideBoardOpen]=useState(false);
    const navigate=useNavigate();

    function handleLogout(){
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(new Event("auth-change"));
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
                <button className="profile-btn"><i className="fa-solid fa-user"></i>Profile</button>
                <button className="wishlist-btn"><i className="fa-solid fa-heart"></i>Wishlist</button>
                <button className="orders-btn"><i className="fa-solid fa-box"></i>Orders</button>
                <button className="settings-btn"><i className="fa-solid fa-gear"></i>Settings</button>
                <button className="logout-btn" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>Logout</button>
            </div>
        </>
    );
}

export default User;