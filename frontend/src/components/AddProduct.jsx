function AddProduct(){
    return(
        <div className="add-product-page">
            <h1>Add Product Details</h1>
            <form className="add-product-form">
                <input type="text" placeholder="Product Name" required/>
                <textarea placeholder="Product Description" required></textarea>
                <textarea placeholder="Why are you selling this product?" required></textarea>
                <input type="number" placeholder="Price" required/>
                <input type="file" accept="image/*" placeholder="Product Image" required/>
            </form>
        </div>
    );
}

export default AddProduct;
