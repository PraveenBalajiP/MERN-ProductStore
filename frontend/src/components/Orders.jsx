import '../css/orders.css';
import {useState,useEffect,useRef} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

function Orders(){
    const {name}=useParams();
    const [orders,setOrders]=useState([]);
    const searchRef=useRef();

    async function fetchOrders(){
        try{
            const response=await axios.get(`http://localhost:5000/api/users/${name}/orders`,{withCredentials:true});
            setOrders(response.data);
        }
        catch(error){
            console.error('Error fetching orders:', error);
        }
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

    return(
        <>
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
                                <div key={order._id} className="order-item">
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