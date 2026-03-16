import {useLocation} from 'react-router-dom';
import '../css/productDetail.css';

function ProductDetail(){
    const location=useLocation();
    const product=location.state?.product;

    return(
        <div className="product-detail">
            <h2>{product?.name}</h2>
            <p>{product?.description}</p>
            <p>Price: ${product?.price.toFixed(2)}</p>
            <button className="add-to-orders">Add to Orders</button>
            <button className="add-to-wishlist">Add to Wishlist</button>
        </div>
    )
}

export default ProductDetail;