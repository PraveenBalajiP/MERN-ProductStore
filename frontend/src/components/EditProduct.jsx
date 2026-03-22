import {useState,useEffect} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../css/addProduct.css';

function EditProduct(){
    const {name,id}=useParams();
    const navigate=useNavigate();
    const [loading,setLoading]=useState(true);
    const [formData,setFormData]=useState({
        productName:'',
        description:'',
        category:'',
        price:'',
        image:null
    });
    const [bid,setBid]=useState('fixed value');

    useEffect(()=>{
        fetchProduct();
    },[id]);

    async function fetchProduct(){
        try{
            const response=await axios.get(`http://localhost:5000/api/users/${name}/products/${id}`,{withCredentials:true});
            const product=response.data;
            setFormData({
                productName:product?.name || '',
                description:product?.description || '',
                category:product?.category || '',
                price:String(product?.price ?? ''),
                image:null
            });
            setBid(product?.bid === 'bid' ? 'bid' : 'fixed value');
        }
        catch(error){
            toast.error(error?.response?.data?.message || 'Error loading product');
            navigate(`/users/${name}/profile`);
        }
        finally{
            setLoading(false);
        }
    }

    function updateFormData(event){
        const {name:valueName,value,files}=event.target;
        if(valueName==='image'){
            setFormData((prev)=>({...prev,image:files?.[0] || null}));
            return;
        }
        setFormData((prev)=>({...prev,[valueName]:value}));
    }

    function toggleSwitch(){
        setBid((previousState)=>previousState === 'bid' ? 'fixed value' : 'bid');
    }

    async function submitUpdatedProduct(event){
        event.preventDefault();
        const payload=new FormData();
        payload.append('name',formData.productName.trim());
        payload.append('description',formData.description.trim());
        payload.append('category',formData.category.trim());
        payload.append('price',String(Number(formData.price)));
        payload.append('bid',bid);
        if(formData.image){
            payload.append('image',formData.image);
        }
        try{
            await axios.patch(`http://localhost:5000/api/users/${name}/products/${id}`,payload,{withCredentials:true});
            toast.success('Product updated successfully');
            navigate(`/users/${name}/profile`);
        }
        catch(error){
            toast.error(error?.response?.data?.message || 'Error updating product');
        }
    }

    if(loading){
        return(
            <div className="add-product-page">
                <div className="add-product-card">
                    <h1>Loading Product...</h1>
                </div>
            </div>
        );
    }

    return(
        <div className="add-product-page">
            <div className="add-product-card">
                <h1>Edit Product Details</h1>
                <form className="add-product-form" onSubmit={submitUpdatedProduct}>
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
                    <div className="add-toggle">
                        <input
                            className="add-product-file"
                            type="file"
                            accept="image/*"
                            name="image"
                            onChange={updateFormData}
                        />
                        <div className="toggle-bid" role="group" aria-label="Select pricing mode">
                            <span className={`toggle-bid-text ${bid === 'fixed value' ? 'active' : ''}`}>Fixed Value</span>
                            <label className="bid-switch" aria-label="Toggle Bid">
                                <input
                                    type="checkbox"
                                    checked={bid === 'bid'}
                                    onChange={toggleSwitch}
                                />
                                <span className="bid-slider"></span>
                            </label>
                            <span className={`toggle-bid-text ${bid === 'bid' ? 'active' : ''}`}>Bid</span>
                        </div>
                    </div>
                    <button type="submit" className="add-product-submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default EditProduct;
