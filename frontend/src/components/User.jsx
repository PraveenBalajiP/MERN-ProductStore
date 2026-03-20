import {useEffect} from "react";
import {useNavigate,Outlet,useParams} from "react-router-dom";
import axios from "axios";
import "../css/user.css";

function User(){
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

    return(
        <>
            <div className="user-content">
                <Outlet />
            </div>
        </>
    );
}

export default User;