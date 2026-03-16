import {useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import "../css/profile.css";

function Profile(){
    const {name}=useParams();
    const [profileData,setProfileData]=useState({});

    async function fetchProfile(){
        const response=await axios.get(`http://localhost:5000/api/users/${name}/profile`,{withCredentials:true});
        setProfileData(response.data);
        console.log(response.data);
    }

    useEffect(()=>{
        fetchProfile();
    },[])

    return(
        <div className="profile-page">
            <div className="profile-pic">
                <i className="fa-solid fa-user"></i>
            </div>
            <div className="profile-info">
                <h1>{profileData.name || "User Name"}</h1>
                <p><span>Email: </span>{profileData.email || "Nil"}</p>
                <p><span>Phone: </span>{profileData.phone || "Nil"}</p>
                <p><span>Address: </span>{profileData.address || "Nil"}</p>
                <button onClick={fetchProfile}>Refresh Profile</button>
            </div>
        </div>
    );
}

export default Profile;