import {useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import ConfirmDialog from "../common_components/ConfirmDialog";
import "../css/profile.css";

function Profile(){
    const {name}=useParams();
    const [profileData,setProfileData]=useState({});
    const [addedProducts,setAddedProducts]=useState([]);
    const [responses,setResponses]=useState([]);
    const [selectedProduct,setSelectedProduct]=useState(null);

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

    async function fetchResponses(){
        try{
            const response=await axios.get(`http://localhost:5000/api/users/${name}/responses`,{withCredentials:true});
            setResponses(response.data);
        }
        catch(error){
            console.error("Error fetching responses:", error);
        }
    }

    useEffect(()=>{
        fetchResponses();
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

    async function confirmDelete(){
        if(!selectedProduct) return;
        await deleteProduct(selectedProduct._id);
        setSelectedProduct(null);
    }

    function formatResponseDateTime(value){
        if(!value) return "Unknown time";
        const parsedDate=new Date(value);
        if(Number.isNaN(parsedDate.getTime())) return "Unknown time";
        const datePart=parsedDate.toLocaleDateString();
        const timePart=parsedDate.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
        return `${datePart}, ${timePart}`;
    }

    return(
        <div className="profile-page">
            <ConfirmDialog
                open={Boolean(selectedProduct)}
                title="Delete Product?"
                message={selectedProduct ? `"${selectedProduct.name}" will be permanently deleted.` : ''}
                confirmText="Delete"
                danger={true}
                onConfirm={confirmDelete}
                onCancel={()=>setSelectedProduct(null)}
            />
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
                            <button onClick={()=>setSelectedProduct(product)}>Delete Product</button>
                        </div>
                    )
                })}
            </div>
            <div className="reponses">
                <h2>Responses</h2>
                {
                    responses.length>0 ? (
                        responses.map((response,index)=>{
                            return(
                                <div className="response-card" key={index}>
                                    <p>{response.message || 'New order update received.'}</p>
                                    <p>From: {response.fromName || 'Unknown User'}</p>
                                    <p>Product: {response.productName || 'Unknown Product'}</p>
                                    <p>Received: {formatResponseDateTime(response.receivedAt)}</p>
                                </div>
                            )
                        })
                    ) : (
                        <p>No responses yet.</p>
                    )
                }
            </div>
        </div>
    );
}

export default Profile;