import {useEffect,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {FiCheckCircle,FiShoppingCart} from 'react-icons/fi';
import { toast } from "react-hot-toast";
import ConfirmDialog from '../common_components/ConfirmDialog';
import '../css/productDetail.css';

function ProductDetail(){
    const location=useLocation();
    const navigate=useNavigate();
    const {name,id}=useParams();
    const product=location.state?.product || null;
    const ownerInfo=product?.ownerDetails;
    const [confirmState,setConfirmState]=useState({open:false,type:'orders'});
    const [isInWishlist,setIsInWishlist]=useState(product?.isInWishlist || false);
    const [cartAnimation,setCartAnimation]=useState(false);
    const [bidValue,setBidValue]=useState('');

    async function addToWishlist(productId){
        try{
            const response=await axios.post(`http://localhost:5000/api/users/${name}/wishlist/add`,{productId},{withCredentials:true});
            setIsInWishlist(true);
            toast.success('Product added to wishlist');
        }
        catch(error){
            console.error('Error adding to wishlist:',error);
            toast.error('Error adding product to wishlist');
        }
    }

    async function syncWishlistStatus(){
        if(!product?._id) return;
        try{
            const response=await axios.get(`http://localhost:5000/api/users/${name}/wishlist`,{withCredentials:true});
            const wishlistItems=Array.isArray(response.data) ? response.data : [];
            const existsInWishlist=wishlistItems.some((item)=>String(item?._id)===String(product._id));
            setIsInWishlist(existsInWishlist);
        }
        catch(error){
            console.error('Error syncing wishlist status:',error);
        }
    }

    useEffect(()=>{
        syncWishlistStatus();
    },[name,product?._id]);

    async function removeFromWishlist(productId){
        try{
            const response=await axios.post(`http://localhost:5000/api/users/${name}/wishlist/remove`,{productId},{withCredentials:true});
            setIsInWishlist(false);
            toast.success('Product removed from wishlist');
        }
        catch(error){
            console.error('Error removing from wishlist:',error);
            toast.error('Error removing product from wishlist');
        }
    }

    async function toggleWishlist(e){
        e.stopPropagation();
        if(isInWishlist){
            await removeFromWishlist(product._id);
        }
        else{
            await addToWishlist(product._id);
        }
    }

    async function addToOrders(productId,offeredBidValue){
        try{
            const response=await axios.post(
                `http://localhost:5000/api/users/${name}/orders/add`,
                {productId,bidValue:offeredBidValue},
                {withCredentials:true}
            );
            setCartAnimation(true);
            setTimeout(() => setCartAnimation(false), 2000);
            toast.success(response?.data?.message || 'Product added to orders');
        }
        catch(error){
            console.error('Error adding to orders:',error);
            toast.error(error?.response?.data?.message || 'Error adding product to orders');
        }
    }

    function askAction(type){
        if(type==='orders' && product?.bid === 'bid'){
            setBidValue(String(Number(product?.price || 0)));
        }
        setConfirmState({open:true,type});
    }

    async function confirmAction(){
        if(!product?._id){
            setConfirmState({open:false,type:'orders'});
            return;
        }
        if(confirmState.type==='orders'){
            let offeredBidValue=null;
            if(product?.bid === 'bid'){
                const numericBid=Number(bidValue);
                if(Number.isNaN(numericBid) || numericBid <= 0){
                    toast.error('Please enter a valid bid value');
                    return;
                }
                offeredBidValue=numericBid;
            }
            await addToOrders(product._id,offeredBidValue);
        }
        setBidValue('');
        setConfirmState({open:false,type:'orders'});
    }

    if(!product){
        return(
            <div className="product-detail">
                <h2>Product details unavailable</h2>
                <p>Open this page from Browse, Wishlist, or Orders to load product data.</p>
                <button className="add-to-orders" onClick={()=>navigate(`/users/${name}/browse`)}>Back to Browse</button>
            </div>
        );
    }

    return(
        <>
            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.type==='orders' ? 'Add to Orders?' : 'Add to Wishlist?'}
                message={confirmState.type==='orders'
                    ? product?.bid === 'bid'
                        ? 'Enter your bid value to confirm the order request.'
                        : 'This product will be added to your orders list.'
                    : 'This product will be added to your wishlist.'}
                confirmText={confirmState.type==='orders' ? 'Add to Orders' : 'Add to Wishlist'}
                onConfirm={confirmAction}
                onCancel={()=>{setBidValue('');setConfirmState({open:false,type:'orders'});}}
            >
                {confirmState.type==='orders' && product?.bid === 'bid' ? (
                    <div className="confirm-extra">
                        <p>Owner Bid Value: ${Number(product?.price || 0).toFixed(2)}</p>
                        <label htmlFor="bid-value">Your Bid Value</label>
                        <input
                            id="bid-value"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={bidValue}
                            onChange={(event)=>setBidValue(event.target.value)}
                            placeholder="Enter your bid"
                        />
                    </div>
                ) : null}
            </ConfirmDialog>
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
                <p>Price: ${Number(product?.price || 0).toFixed(2)}</p>
                <p>
                    Owner Type: {product?.ownerType === "agent" ? "Agent" : "Owner"}<br/>
                    Name: {ownerInfo?.name || "N/A"}<br/>
                    Email: {ownerInfo?.email || "N/A"}<br/>
                    Phone: {ownerInfo?.phone || "N/A"}<br/>
                    Address: {ownerInfo?.address || "N/A"}
                </p>
                <p className="bid-info">{product?.bid === "bid" ? "This product is open for BIDDING." : "This product has a FIXED PRICE."}</p>
                <div className="buttons">
                    <button className={`add-to-wishlist ${isInWishlist ? 'active' : ''}`} onClick={toggleWishlist}>
                    <i className={isInWishlist ? 'fas fa-heart' : 'far fa-heart'}></i>
                    </button>
                    <button className="add-to-orders" onClick={()=>askAction('orders')}>Add to Orders</button>
                </div>
            </div>
            {cartAnimation && (
                <>
                    <div className="order-confirmation-overlay"></div>
                    <div className="cart-animation">
                        <div className="cart-icon"><FiShoppingCart aria-hidden="true"/></div>
                        <div className="confirmation-tick" aria-hidden="true"><FiCheckCircle/></div>
                        <div className="confirmation-label">Order Confirmed</div>
                    </div>
                </>
            )}
        </>
    )
}

export default ProductDetail;