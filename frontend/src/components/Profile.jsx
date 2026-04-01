import {useState,useEffect} from "react";
import {useParams,useNavigate} from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import ConfirmDialog from "../common_components/ConfirmDialog";
import "../css/profile.css";

function Profile(){
    const {name}=useParams();
    const navigate=useNavigate();
    const [profileData,setProfileData]=useState({});
    const [addedProducts,setAddedProducts]=useState([]);
    const [responses,setResponses]=useState([]);
    const [acceptedDeals,setAcceptedDeals]=useState([]);
    const [pastDeals,setPastDeals]=useState([]);
    const [selectedProduct,setSelectedProduct]=useState(null);

    function getErrorMessage(error,fallbackMessage){
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            fallbackMessage
        );
    }

    async function fetchProfile(){
        try{
            const response=await axios.get(`/api/users/${name}/profile`,{withCredentials:true});
            setProfileData(response.data);
            console.log(response.data);
        }
        catch(error){
            toast.error(getErrorMessage(error,"Unable to fetch profile"));
        }
    }

    useEffect(()=>{
        fetchProfile();
    },[])

    async function fetchAddedProducts(){
        try{
            const response=await axios.get(`/api/users/${name}/addedProducts`,{withCredentials:true});
            setAddedProducts(response.data);
            console.log(response.data);

        }
        catch(error){
            console.error("Error fetching added products:", error);
            toast.error(getErrorMessage(error,"Unable to fetch added products"));
        }
    }

    useEffect(()=>{
        fetchAddedProducts();
    },[])

    async function fetchResponses(){
        try{
            const response=await axios.get(`/api/users/${name}/responses`,{withCredentials:true});
            setResponses(response.data);
        }
        catch(error){
            console.error("Error fetching responses:", error);
            toast.error(getErrorMessage(error,"Unable to fetch responses"));
        }
    }

    useEffect(()=>{
        fetchResponses();
    },[])

    useEffect(()=>{
        const intervalId=setInterval(()=>{
            fetchResponses();
        },8000);

        return ()=>clearInterval(intervalId);
    },[name]);

    async function fetchAcceptedDeals(){
        try{
            const response=await axios.get(`/api/users/${name}/acceptedDeals`,{withCredentials:true});
            setAcceptedDeals(response.data);
        }
        catch(error){
            console.error("Error fetching accepted deals:", error);
            toast.error(getErrorMessage(error,"Unable to fetch accepted deals"));
        }
    }

    useEffect(()=>{
        fetchAcceptedDeals();
    },[])

    async function fetchPastDeals(){
        try{
            const response=await axios.get(`/api/users/${name}/pastDeals`,{withCredentials:true});
            setPastDeals(response.data);
        }
        catch(error){
            console.error("Error fetching past deals:", error);
            toast.error(getErrorMessage(error,"Unable to fetch past deals"));
        }
    }

    useEffect(()=>{
        fetchPastDeals();
    },[])


    async function deleteProduct(productId){
        try{
            await axios.delete(`/api/users/${name}/deleteProduct`,{
                data:{productId},
                withCredentials:true
            });
            setAddedProducts((prev)=>prev.filter((product)=>product._id!==productId));
            toast.success("Product deleted successfully");
        }
        catch(error){
            toast.error(getErrorMessage(error,"Error deleting product"));
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

    async function editProduct(productId){
        navigate(`/users/${name}/editProduct/${productId}`);
    }

    async function acceptDeal(productId,fromUserId){
        try{
            const responseDeal=await axios.post(`/api/users/${name}/${productId}/acceptDeal`,{fromUserId},{withCredentials:true});
            toast.success(responseDeal.data.message || "Deal accepted successfully");
            fetchResponses();
            fetchAcceptedDeals();
            fetchAddedProducts();
        }
        catch(error){
            toast.error(getErrorMessage(error,"Error accepting deal"));
        }
    }

    async function closeDeal(productId){
        try{
            const response=await axios.post(`/api/users/${name}/${productId}/closeDeal`,{},{withCredentials:true});
            toast.success(response.data.message || "Deal closed successfully");
            fetchAcceptedDeals();
            fetchPastDeals();
            fetchAddedProducts();
        }
        catch(error){
            toast.error(getErrorMessage(error,"Error closing deal"));
        }
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
                {
                    addedProducts.length>0 ?(
                        addedProducts.map(product=>{
                        return(
                            <div className="product-card" key={product._id}>
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Category: {product.category}</p>
                                <p>Price: ${product.price.toFixed(2)}</p>
                                <div className="product-actions">
                                    <button className="product-edit-btn" onClick={()=>editProduct(product._id)}>Edit Product</button>
                                    <button className="product-delete-btn" onClick={()=>setSelectedProduct(product)}>Delete Product</button>
                                </div>
                            </div>
                            )
                        })
                    ):(
                        <p>No products added yet.</p>
                    )
                }
            </div>
            <div className="reponses">
                <h2>Responses</h2>
                <button type="button" onClick={fetchResponses}>Refresh Responses</button>
                {
                    responses.length>0 ? (
                        responses.map((response)=>{
                            return(
                                <div className="response-card" key={response._id}>
                                    <p>{response.message || 'New order update received.'}</p>
                                    <p>From: {response.fromName || 'Unknown User'}</p>
                                    <p>Contact: {response.fromContact || 'Not available'}</p>
                                    <p>Product: {response.productName || 'Unknown Product'}</p>
                                    {response.bidValue!==null && response.bidValue!==undefined ? <p>Bid Value: ${Number(response.bidValue).toFixed(2)}</p> : null}
                                    <p>Received: {formatResponseDateTime(response.receivedAt)}</p>
                                    <button onClick={()=>acceptDeal(response.productId,response.from)}>Accept Deal</button>
                                </div>
                            )
                        })
                    ) : (
                        <p>No responses yet.</p>
                    )
                }
            </div>
            <div className="accepted-deals">
                <h2>Accepted Deals</h2>
                {
                    acceptedDeals.length>0 ? (
                        acceptedDeals.map((deal)=>{
                            return(
                                <div className="deal-card" key={deal._id}>
                                    <p><strong>Product:</strong> {deal.productName || 'Unknown'}</p>
                                    <p><strong>With:</strong> {deal.withUserName || 'Unknown User'}</p>
                                    <p><strong>Deal Value:</strong> ${Number(deal.dealValue).toFixed(2)}</p>
                                    <p><strong>Accepted:</strong> {formatResponseDateTime(deal.acceptedAt)}</p>
                                    <button onClick={()=>closeDeal(deal.productId)}>Close Deal</button>
                                </div>
                            )
                        })
                    ) : (
                        <p>No accepted deals yet.</p>
                    )
                }
            </div>
            <div className="past-deals">
                <h2>Past Deals</h2>
                {
                    pastDeals.length>0 ? (
                        pastDeals.map((deal)=>{
                            return(
                                <div className="deal-card" key={deal._id}>
                                    <p><strong>Product:</strong> {deal.productName || 'Unknown'}</p>
                                    <p><strong>With:</strong> {deal.withUserName || 'Unknown User'}</p>
                                    <p><strong>Deal Value:</strong> ${Number(deal.dealValue).toFixed(2)}</p>
                                    <p><strong>Completed:</strong> {formatResponseDateTime(deal.dealDate)}</p>
                                </div>
                            )
                        })
                    ) : (
                        <p>No past deals yet.</p>
                    )
                }
            </div>
        </div>
    );
}

export default Profile;