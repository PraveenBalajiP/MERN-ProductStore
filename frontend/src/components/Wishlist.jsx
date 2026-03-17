import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import '../css/wishlist.css';

function Wishlist(){
    const {name}=useParams();
    const [wishlist,setWishlist]=useState([]);

    async function fetchWishlist(){
        try{
            const response=await axios.get(`http://localhost:5000/api/users/${name}/wishlist`,{withCredentials:true});
            setWishlist(response.data);
        }
        catch(error){
            console.error('Error fetching wishlist:', error);
        }
    }

    useEffect(()=>{
        fetchWishlist();
    },[])

    return(
        <>
            <div className="wishlist-page">
                <div className="wishlist-header">
                    <input type="text" placeholder="Search wishlist..." className="search-bar"/>
                    <button className="search-button">Search</button>
                    <button className="refresh-button" onClick={fetchWishlist}>Refresh</button>
                </div>
                <div className="wishlist-list">
                    <div className="wishlist-card">
                        {wishlist.map(item=>{
                            return(
                                <div key={item._id} className="wishlist-item">
                                    <h2>{item.name}</h2>
                                    <p>{item.description}</p>
                                    <p>Price: ${item.price.toFixed(2)}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Wishlist;