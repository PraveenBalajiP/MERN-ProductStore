import {useState,useEffect,useRef} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../css/browse.css';

function Browse(){
    const {name}=useParams();
    const navigate = useNavigate();
    const [products,setProducts] = useState([]);
    const searchRef=useRef();
    
    async function fetchProducts(){
        try{
            const response=await axios.get(`/api/users/${name}/products`,{withCredentials:true});
            const visibleProducts=Array.isArray(response.data)
                ? response.data.filter((product)=>product?.dealStatus !== "sold")
                : [];
            setProducts(visibleProducts);
        }
        catch(error){
            console.error('Error fetching products:',error);
        }
    }

    async function navigateProductDetail(productId){
        const responseProduct=await axios.get(`/api/users/${name}/products/${productId}`,{withCredentials:true});
        navigate(`/users/${name}/products/${productId}`,{state:{product:responseProduct.data}});
    }

    useEffect(()=>{
        fetchProducts();
    },[name])

    function searchFeature(){
        if(searchRef.current.value.trim()===""){
            fetchProducts();
            return;
        }
        const filteredProducts=products.filter(product=>{
            return product.name.toLowerCase().includes(searchRef.current.value.toLowerCase());
        })
        if(filteredProducts.length>0)
            setProducts(filteredProducts);
        else
            setProducts([]);
    }

    function refreshFeature(){
        fetchProducts();
        searchRef.current.value="";
    }

    return(
        <div className="browse-page">
            <div className="browse-header">
                <input  type="text" 
                        placeholder="Search products..." 
                        className="search-bar"
                        ref={searchRef}/>
                <button className="search-button" onClick={searchFeature}>Search</button>
                <button className="refresh-button" onClick={refreshFeature}>Refresh</button>
            </div>
            {
                products.length>0?(
                    <div className="product-list">
                    <div className="product-card">
                    {products.map(product=>{
                        return(
                            <div key={product._id} className="product-item" onClick={()=>navigateProductDetail(product._id)}>
                                {
                                    product.imageUrl?(
                                        <img src={product.imageUrl} alt={product.name} className="product-image-slot"/>
                                    ):(
                                        <div className="product-image-slot" aria-label="Product image placeholder"></div>
                                    )
                                }
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <div className="details">
                                    <span className="price">Price: ₹ {product.price}</span>
                                    <span className="bid-type">{product.bid==="bid"?"Bidding":"Fixed Price"}</span>
                                </div>
                                {product.bid === "bid" ? (
                                    <div className="bid-range">
                                        <span>Highest: ${Number(product.highestBid ?? product.price).toFixed(2)}</span>
                                        <span>Lowest: ${Number(product.lowestBid ?? product.price).toFixed(2)}</span>
                                    </div>
                                ) : null}
                            </div>
                        )
                    })}
                </div>
            </div>
                ):(
                    <div className="no-products">
                        <p>No products found.</p>
                    </div>
                )
            }
        </div>
    );
}

export default Browse;