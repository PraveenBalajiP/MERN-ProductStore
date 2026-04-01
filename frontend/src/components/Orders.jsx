import '../css/orders.css';
import {useState,useEffect,useRef} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '../common_components/ConfirmDialog';

function Orders(){
    const {name}=useParams();
    const navigate=useNavigate();
    const [orders,setOrders]=useState([]);
    const [confirmState,setConfirmState]=useState({open:false,orderId:null});
    const searchRef=useRef();

    async function fetchOrders(){
        try{
            const response=await axios.get(`/api/users/${name}/orders`,{withCredentials:true});
            setOrders(response.data);
        }
        catch(error){
            console.error('Error fetching orders:', error);
            toast.error('Error fetching orders');
        }
    }

    async function removeFromOrders(productId){
        try{
            await axios.post(`/api/users/${name}/orders/remove`,{productId},{withCredentials:true});
            setOrders(orders.filter(order => order._id !== productId));
            toast.success('Removed from orders');
        }
        catch(error){
            console.error('Error removing from orders:', error);
            toast.error('Error removing from orders');
        }
    }

    function askRemoveOrder(orderId){
        setConfirmState({open:true,orderId});
    }

    async function confirmRemoveOrder(){
        if(confirmState.orderId){
            await removeFromOrders(confirmState.orderId);
        }
        setConfirmState({open:false,orderId:null});
    }

    useEffect(()=>{
        fetchOrders();
    },[])

    function searchFeature(){
        if(searchRef.current.value.trim()===""){
            fetchOrders();
            return;
        }
        const filteredOrders=orders.filter(order=>{
            return order.name.toLowerCase().includes(searchRef.current.value.toLowerCase());
        })
        if(filteredOrders.length>0)
            setOrders(filteredOrders);
        else
            setOrders([]);
    }

    function refreshFeature(){
        fetchOrders();
        searchRef.current.value="";
    }

    async function navigateProductDetail(productId){
        const responseProduct=await axios.get(`/api/users/${name}/products/${productId}`,{withCredentials:true});
        navigate(`/users/${name}/products/${productId}`,{state:{product:responseProduct.data}});
    }

    return(
        <>
            <ConfirmDialog
                open={confirmState.open}
                title="Remove order?"
                message="This order item will be removed from your orders list."
                confirmText="Remove"
                cancelText="Cancel"
                danger={true}
                onConfirm={confirmRemoveOrder}
                onCancel={()=>setConfirmState({open:false,orderId:null})}
            />
            <div className="orders-page">
                <div className="orders-header">
                    <input type="text" 
                            placeholder="Search orders..." className="search-bar" ref={searchRef}/>
                    <button className="search-button" onClick={searchFeature}>Search</button>
                    <button className="refresh-button" onClick={refreshFeature}>Refresh</button>
                </div>
                <div className="orders-list">
                    <div className="order-card">
                        {orders.map(order=>{
                            return(
                                <div    key={order._id} 
                                        className="order-item"
                                        onClick={()=>navigateProductDetail(order._id)}>
                                    {
                                        order.imageUrl?(
                                            <img src={order.imageUrl} alt={order.name} className="order-image-slot"/>
                                        ):(
                                            <div className="order-image-slot" aria-label="Product image placeholder"></div>
                                        )
                                    }
                                    <h2>Order #{order._id}</h2>
                                    <p>Product: {order.name}</p>
                                    <p>Price: ${order.price.toFixed(2)}</p>
                                    <p>Status: {order.status}</p>
                                    <button className="remove-button" onClick={(e) => {
                                        e.stopPropagation();
                                        askRemoveOrder(order._id);
                                    }}>
                                        <i className="fas fa-trash"></i> Remove
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Orders;