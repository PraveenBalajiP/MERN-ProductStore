import {useLocation} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-hot-toast";
import '../css/productDetail.css';

function ProductDetail(){
    const location=useLocation();
    const {name}=useParams();
    const product=location.state?.product;
    const ownerInfo=product?.ownerDetails;

    async function addToWishlist(productId){
        try{
            const response=await axios.post(`http://localhost:5000/api/users/${name}/wishlist/add`,{productId},{withCredentials:true});
            toast.success('Product added to wishlist');
        }
        catch(error){
            console.error('Error adding to wishlist:',error);
            toast.error('Error adding product to wishlist');
        }
    }

    async function addToOrders(productId){
        try{
            const response=await axios.post(`http://localhost:5000/api/users/${name}/orders/add`,{productId},{withCredentials:true});
            toast.success('Product added to orders');
        }
        catch(error){
            console.error('Error adding to orders:',error);
            toast.error('Error adding product to orders');
        }
    }

    return(
        <div className="product-detail">
            {
                product?.imageUrl?(
                    <img src={product.imageUrl} alt={product?.name} className="product-detail-image"/>
                ):(
                    <div className="product-detail-image" aria-label="Product image placeholder"></div>
                )
            }
            <h2>{product?.name}</h2>
            <p>{product?.description}</p>
            <p>Category: {product?.category}</p>
            <p>Price: ${product?.price.toFixed(2)}</p>
            <p>
                Owner Type: {product?.ownerType === "agent" ? "Agent" : "Owner"}<br/>
                Name: {ownerInfo?.name || "N/A"}<br/>
                Email: {ownerInfo?.email || "N/A"}<br/>
                Phone: {ownerInfo?.phone || "N/A"}<br/>
                Address: {ownerInfo?.address || "N/A"}
            </p>
            <button className="add-to-orders" onClick={()=>addToOrders(product._id)}>Add to Orders</button>
            <button className="add-to-wishlist" onClick={()=>addToWishlist(product._id)}>Add to Wishlist</button>
        </div>
    )
}

export default ProductDetail;