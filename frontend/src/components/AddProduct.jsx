import {useState,useEffect} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '../common_components/ConfirmDialog';
import '../css/addProduct.css';

function AddProduct(){
    const {name}=useParams();
    const navigate=useNavigate();
    const [isOwner,setIsOwner]=useState(true);
    const [formData,setFormData]=useState({
        productName:"",
        description:"",
        category:"",
        price:"",
        image:null
    });
    const [ownerDetails,setOwnerDetails]=useState({
        name:"",
        email:"",
        phone:"",
        address:""
    });
    const [agentDetails,setAgentDetails]=useState({
        name:"",
        email:"",
        phone:"",
        address:""
    });
    const [showConfirm,setShowConfirm]=useState(false);
    const [pendingData,setPendingData]=useState(null);

    async function fetchOwnerDetails(){
        try{
            const response=await axios.get(`http://localhost:5000/api/users/${name}/profile`,{withCredentials:true});
            setOwnerDetails(response.data);
        }
        catch(error){
            console.error("Error fetching owner details:", error);
        }
    }

    useEffect(()=>{
        fetchOwnerDetails();
    },[name]);

    function updateFormData(event){
        const {name:valueName,value,files}=event.target;
        if(valueName==="image"){
            setFormData((prev)=>({...prev,image:files?.[0] || null}));
            return;
        }
        setFormData((prev)=>({...prev,[valueName]:value}));
    }

    async function submitProduct(dataSnapshot){
        const payload=new FormData();
        payload.append("name",dataSnapshot.formData.productName.trim());
        payload.append("description",dataSnapshot.formData.description.trim());
        payload.append("category",dataSnapshot.formData.category.trim());
        payload.append("price",String(Number(dataSnapshot.formData.price)));
        const activeOwnerDetails=dataSnapshot.isOwner ? dataSnapshot.ownerDetails : dataSnapshot.agentDetails;
        payload.append("ownerType",dataSnapshot.isOwner ? "owner" : "agent");
        payload.append("ownerName",activeOwnerDetails.name || "");
        payload.append("ownerEmail",activeOwnerDetails.email || "");
        payload.append("ownerPhone",activeOwnerDetails.phone || "");
        payload.append("ownerAddress",activeOwnerDetails.address || "");
        if(dataSnapshot.formData.image){
            payload.append("image",dataSnapshot.formData.image);
        }
        try{
            const response=await axios.post(`http://localhost:5000/api/users/${name}/browse`,payload,{withCredentials:true});
            await axios.post(
                `http://localhost:5000/api/users/${name}/addedProducts`,
                {productId:response.data.productId},
                {withCredentials:true}
            );
            toast.success(response.data.message || "Product added successfully");
            setFormData({
                productName:"",
                description:"",
                category:"",
                price:"",
                image:null,
            });
            setAgentDetails({name:"",email:"",phone:"",address:""});
            navigate(`/users/${name}/browse`);
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Error adding product");
        }
    }

    function addProductToList(event){
        event.preventDefault();
        setPendingData({
            formData:{...formData},
            isOwner,
            ownerDetails:{...ownerDetails},
            agentDetails:{...agentDetails}
        });
        setShowConfirm(true);
    }

    async function confirmAddProduct(){
        if(!pendingData) return;
        await submitProduct(pendingData);
        setShowConfirm(false);
        setPendingData(null);
    }

    return(
        <div className="add-product-page">
            <ConfirmDialog
                open={showConfirm}
                title="Add Product?"
                message="This will publish the product and add it to your profile list."
                confirmText="Add Product"
                onConfirm={confirmAddProduct}
                onCancel={()=>{setShowConfirm(false);setPendingData(null);}}
            />
            <div className="add-product-card">
                <h1>Add Product Details</h1>
                <form className="add-product-form" onSubmit={addProductToList}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        name="productName"
                        value={formData.productName}
                        onChange={updateFormData}
                        required
                    />
                    <textarea
                        className="add-product-description"
                        placeholder="Product Description"
                        name="description"
                        value={formData.description}
                        onChange={updateFormData}
                        required
                    ></textarea>
                    <textarea
                        className="add-product-reason"
                        placeholder="Category"
                        name="category"
                        value={formData.category}
                        onChange={updateFormData}
                        required
                    ></textarea>
                    <input
                        type="number"
                        placeholder="Price"
                        name="price"
                        value={formData.price}
                        onChange={updateFormData}
                        min="1"
                        required
                    />
                    <input
                        className="add-product-file"
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={updateFormData}
                    />
                    <button type="submit" className="add-product-submit">Add Product</button>
                </form>
                <div className="owner-details">
                    <h2>Owner Details</h2>
                    <input
                        type="radio"
                        id="owner"
                        name="owner"
                        value="own"
                        checked={isOwner}
                        onChange={()=>setIsOwner(true)}
                    />
                    <label htmlFor="owner">Owner</label>
                    <input
                        type="radio"
                        id="agent"
                        name="owner"
                        value="agent"
                        checked={!isOwner}
                        onChange={()=>setIsOwner(false)}
                    />
                    <label htmlFor="agent">Doing for someone else</label>
                    {
                        isOwner?(
                            <div className="owner-info">
                                <label htmlFor="owner-name">Name</label>
                                <input type="text" id="owner-name" value={ownerDetails.name} readOnly/>
                                <label htmlFor="owner-email">Email</label>
                                <input type="email" id="owner-email" value={ownerDetails.email} readOnly/>
                                <label htmlFor="owner-phone">Phone</label>
                                <input type="text" id="owner-phone" value={ownerDetails.phone} readOnly/>
                                <label htmlFor="owner-address">Address</label>
                                <textarea id="owner-address" value={ownerDetails.address} readOnly></textarea>
                            </div>
                        ):(
                            <div className="agent-info">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={agentDetails.name}
                                    onChange={(e)=>setAgentDetails({...agentDetails,name:e.target.value})}
                                    required={!isOwner}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={agentDetails.email}
                                    onChange={(e)=>setAgentDetails({...agentDetails,email:e.target.value})}
                                    required={!isOwner}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={agentDetails.phone}
                                    onChange={(e)=>setAgentDetails({...agentDetails,phone:e.target.value})}
                                    required={!isOwner}
                                />
                                <textarea
                                    placeholder="Address"
                                    value={agentDetails.address}
                                    onChange={(e)=>setAgentDetails({...agentDetails,address:e.target.value})}
                                    required={!isOwner}
                                ></textarea>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default AddProduct;
