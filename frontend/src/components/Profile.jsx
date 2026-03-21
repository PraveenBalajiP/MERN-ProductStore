import {useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../css/profile.css";

function Profile(){
    const {name}=useParams();
    const [profileData,setProfileData]=useState({});
    const [addedProducts,setAddedProducts]=useState([]);

    async function fetchProfile(){
        const response=await axios.get(`http://localhost:5000/api/users/${name}/profile`,{withCredentials:true});
        setProfileData(response.data);
        console.log(response.data);
    }

    useEffect(()=>{
        fetchProfile();
    },[])

    async function fetchAddedProducts(){
        try{
            const response=await axios.get(`http://localhost:5000/api/users/${name}/addedProducts`,{withCredentials:true});
            setAddedProducts(response.data);
            console.log(response.data);

        }
        catch(error){
            console.error("Error fetching added products:", error);
        }
    }

    useEffect(()=>{
        fetchAddedProducts();
    },[])

    async function deleteProduct(productId){
        try{
            await axios.delete(`http://localhost:5000/api/users/${name}/deleteProduct`,{
                data:{productId},
                withCredentials:true
            });
            setAddedProducts((prev)=>prev.filter((product)=>product._id!==productId));
            toast.success("Product deleted successfully");
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Error deleting product");
        }
    }

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
            <div className="products">
                <h2>Added Products</h2>
                {addedProducts.map(product=>{
                    return(
                        <div className="product-card" key={product._id}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Category: {product.category}</p>
                            <p>Price: ${product.price.toFixed(2)}</p>
                            <button onClick={()=>deleteProduct(product._id)}>Delete Product</button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Profile;