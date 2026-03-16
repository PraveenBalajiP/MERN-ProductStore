import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import '../css/browse.css';

function Browse(){
    const {name}=useParams();
    const [products,setProducts] = useState([]);
    async function fetchProducts(){
        try{
            const response=await axios.get(`http://localhost:5000/api/users/${name}/products`,{withCredentials:true});
            setProducts(response.data);
        }
        catch(error){
            console.error('Error fetching products:',error);
        }
    }

    useEffect(()=>{
        fetchProducts();
    },[name])

    
    return(
        <div className="browse-page">
            <div className="browse-header">
                <input type="text" placeholder="Search products..." className="search-bar"/>
                <button className="search-button">Search</button>
                <button className="refresh-button" onClick={fetchProducts}>Refresh</button>
            </div>
            <div className="product-list">
                <div className="product-card">
                    {products.map(product=>{
                        return(
                            <div key={product._id} className="product-item">
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Browse;