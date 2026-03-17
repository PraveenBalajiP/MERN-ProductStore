import '../css/orders.css';
import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

function Orders(){
    const {name}=useParams();
    const [orders,setOrders]=useState([]);

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

    return(
        <>
            <div className="orders-page">
                <div className="orders-header">
                    <input type="text" placeholder="Search orders..." className="search-bar"/>
                    <button className="search-button">Search</button>
                    <button className="refresh-button" onClick={fetchOrders}>Refresh</button>
                </div>
                <div className="orders-list">
                    <div className="order-card">
                        {orders.map(order=>{
                            return(
                                <div key={order._id} className="order-item">
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