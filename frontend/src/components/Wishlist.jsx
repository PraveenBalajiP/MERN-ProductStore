import {useState,useEffect,useRef} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../css/wishlist.css';

function Wishlist(){
    const {name}=useParams();
    const navigate=useNavigate();
    const [wishlist,setWishlist]=useState([]);
    const searchRef=useRef();

    async function fetchWishlist(){
        try{
            const response=await axios.get(`http://localhost:5000/api/users/${name}/wishlist`,{withCredentials:true});
            setWishlist(response.data);
        }
        catch(error){
            console.error('Error fetching wishlist:', error);
            toast.error('Error fetching wishlist');
        }
    }

    async function removeFromWishlist(productId){
        try{
            await axios.post(`http://localhost:5000/api/users/${name}/wishlist/remove`,{productId},{withCredentials:true});
            setWishlist((prev)=>prev.filter((item)=>String(item._id)!==String(productId)));
            await fetchWishlist();
            toast.success('Removed from wishlist');
        }
        catch(error){
            console.error('Error removing from wishlist:', error);
            toast.error('Error removing from wishlist');
        }
    }

    useEffect(()=>{
        fetchWishlist();
    },[])

    function searchFeature(){
        if(searchRef.current.value.trim()===""){
            fetchWishlist();
            return;
        }
        const filteredWishlist=wishlist.filter(item=>{
            return item.name.toLowerCase().includes(searchRef.current.value.toLowerCase());
        })
        if(filteredWishlist.length>0)
            setWishlist(filteredWishlist);
        else
            setWishlist([]);
    }

    function refreshFeature(){
        fetchWishlist();
        searchRef.current.value="";
    }

    async function navigateProductDetail(productId){
        const responseProduct=await axios.get(`http://localhost:5000/api/users/${name}/products/${productId}`,{withCredentials:true});
        navigate(`/users/${name}/products/${productId}`,{state:{product:responseProduct.data}});
    }

    return(
        <>
            <div className="wishlist-page">
                <div className="wishlist-header">
                    <input type="text" 
                    placeholder="Search wishlist..." className="search-bar" ref={searchRef}/>
                    <button className="search-button" onClick={searchFeature}>Search</button>
                    <button className="refresh-button" onClick={refreshFeature}>Refresh</button>
                </div>
                <div className="wishlist-list">
                    <div className="wishlist-card">
                        {wishlist.map(item=>{
                            return(
                                <div    key={item._id} 
                                        className="wishlist-item"
                                        onClick={()=>navigateProductDetail(item._id)}>
                                    {
                                        item.imageUrl?(
                                            <img src={item.imageUrl} alt={item.name} className="wishlist-image-slot"/>
                                        ):(
                                            <div className="wishlist-image-slot" aria-label="Product image placeholder"></div>
                                        )
                                    }
                                    <h2>{item.name}</h2>
                                    <p>{item.description}</p>
                                    <p>Price: ${item.price.toFixed(2)}</p>
                                    <button className="remove-button" onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromWishlist(item._id);
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

export default Wishlist;