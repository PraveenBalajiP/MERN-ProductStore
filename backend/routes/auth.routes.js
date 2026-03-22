import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/users.models.js';
import Product from '../models/products.models.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authUser from '../middleware/authUser.js';
import multer from 'multer';

dotenv.config();

const routes=express.Router();
const upload=multer({storage:multer.memoryStorage()});

function generateTokenAndCookie(id,res){
    const token=jwt.sign({id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1d"});
    res.cookie("login_token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:24*60*60*1000
    });
}

routes.post("/signup",async (req,res)=>{
    const {name,contact,password,address}=req.body;

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const userData={
        name,
        contact,
        password:hashedPassword,
        address
    };

    const savedData=new User(userData);
    console.log(savedData);
    try{
        if(await User.findOne({contact:contact})){
            res.status(400).json({message:"User already exists with this contact"});
        }
        else{
            await savedData.save();
            res.status(201).json({message:"User registered successfully"});
            
        }
    }
    catch(error){
        res.status(500).json({message:"Error during registration",error:error.message});
    }
})

routes.post("/login",async (req,res)=>{
    const {contact,password}=req.body;
    const user=await User.findOne({contact:contact});
    console.log(user);
    try{
        if(!user){
            res.status(400).json({message:"No User Found, Kindly Sign Up before Logging In"});
        }
        else{
            const passwordMatch=await bcrypt.compare(password,user.password);
            if(!passwordMatch){
                res.status(400).json({message:"Incorrect Password Entered"});
            }
            else{
                generateTokenAndCookie(user._id,res);
                console.log({...user,message:"Login Successful"});
                const userData={
                    name:user.name,
                    contact:user.contact,
                    message:"Login Successful"
                }
                res.status(200).json(userData);
            }
        }
    }
    catch(error){
        res.status(500).json({message:"Error during login",error:error.message});
    }
})

routes.get("/check-auth",authUser,(req,res)=>{
    res.status(200).json({message:"Authorized",status:"Authorized"});
})

routes.get("/:name",authUser,async (req,res)=>{
    const userName=req.params.name;
    try{
        const user=await User.findOne({name:userName});
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            res.status(200).json({name:user.name,contact:user.contact});
        }
    }
    catch(error){
        res.status(500).json({message:"Error fetching user",error:error.message});
    }
})

routes.post("/logout",authUser,(req,res)=>{
    res.clearCookie("login_token");
    res.status(200).json({message:"Logout Successful"});
})

routes.get("/:name/profile",authUser,async (req,res)=>{
    const userName=req.params.name;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only access your own profile"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            res.status(200).json({
                name:user.name,
                email:user.contact.includes("@")?user.contact:"",
                phone:user.contact.match(/^\d{10}$/)?user.contact:"",
                address:user.address
            });
        }
    }
    catch(error){
        res.status(500).json({message:"Error fetching user profile",error:error.message});
    }

})

routes.post("/:name/browse",authUser,upload.single("image"),async (req,res)=>{
    try{
        const userName=req.params.name;
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only add product to your own account"});
        }
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }

        const {
            name,
            description,
            price,
            category,
            bid,
            ownerType,
            ownerName,
            ownerEmail,
            ownerPhone,
            ownerAddress
        }=req.body;
        const newProduct=new Product({
            name,
            description,
            price,
            category,
            bid:bid === "bid" ? "bid" : "fixed value",
            owner:user._id,
            ownerType:ownerType || "owner",
            ownerDetails:{
                name:ownerName || "",
                email:ownerEmail || "",
                phone:ownerPhone || "",
                address:ownerAddress || ""
            },
            imageData:req.file?.buffer,
            imageContentType:req.file?.mimetype
        });
        await newProduct.save();
        res.status(201).json({message:"Product added successfully",productId:newProduct._id});
    }
    catch(error){
        res.status(500).json({message:"Error adding product",error:error.message});
    }
})

routes.get("/:name/products",authUser,async (req,res)=>{
    try{
        const products=await Product.find();
        const productsWithImages=products.map((product)=>({
            ...product.toObject(),
            imageUrl:product.imageData && product.imageContentType
                ?`data:${product.imageContentType};base64,${product.imageData.toString("base64")}`
                :null
        }));
        res.status(200).json(productsWithImages);
    }
    catch(error){
        res.status(500).json({message:"Error fetching products",error:error.message});
    }
})

routes.get("/:name/products/:id",authUser,async (req,res)=>{
    const productId=req.params.id;
    try{
        const product=await Product.findOne({_id:productId});
        if(!product){
            res.status(404).json({message:"Product Not Found"});
        }
        else{
            const productData={
                ...product.toObject(),
                imageUrl:product.imageData && product.imageContentType
                    ?`data:${product.imageContentType};base64,${product.imageData.toString("base64")}`
                    :null
            };
            res.status(200).json(productData);
        }
    }
    catch(error){
        res.status(500).json({message:"Error fetching product",error:error.message});
    }
})

routes.post("/:name/wishlist/add",authUser,async (req,res)=>{
    const userName=req.params.name;
    const {productId}=req.body;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only modify your own wishlist"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            if(user.wishlist.includes(productId)){
                return res.status(400).json({message:"Product already in wishlist"});
            }
            else{
                user.wishlist.push(productId);
                await user.save();
                res.status(200).json({message:"Product added to wishlist"});
            }
        }
    }
    catch(error){
        res.status(500).json({message:"Error modifying wishlist",error:error.message});
    }
})

routes.post("/:name/wishlist/remove",authUser,async (req,res)=>{
    const userName=req.params.name;
    const {productId}=req.body;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only modify your own wishlist"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            if(!user.wishlist.includes(productId)){
                return res.status(400).json({message:"Product not in wishlist"});
            }
            else{
                user.wishlist=user.wishlist.filter(id=>id.toString()!==productId);
                await user.save();
                res.status(200).json({message:"Product removed from wishlist"});
            }
        }
    }
    catch(error){
        res.status(500).json({message:"Error modifying wishlist",error:error.message});
    }
})

routes.post("/:name/orders/add",authUser,async (req,res)=>{
    const userName=req.params.name;
    const {productId}=req.body;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only modify your own orders"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            if(user.orders.includes(productId)){
                return res.status(400).json({message:"Product already in orders"});
            }
            else{
                user.orders.push(productId);
                await user.save();
                res.status(200).json({message:"Product added to orders"});
            }
        }
    }
    catch(error){
        res.status(500).json({message:"Error modifying orders",error:error.message});
    }
})

routes.post("/:name/orders/remove",authUser,async (req,res)=>{
    const userName=req.params.name;
    const {productId}=req.body;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only modify your own orders"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            if(!user.orders.includes(productId)){
                return res.status(400).json({message:"Product not in orders"});
            }
            else{
                user.orders=user.orders.filter(id=>id.toString()!==productId);
                await user.save();
                res.status(200).json({message:"Product removed from orders"});
            }
        }
    }
    catch(error){
        res.status(500).json({message:"Error modifying orders",error:error.message});
    }
})

routes.get("/:name/orders",authUser,async (req,res)=>{
    const userName=req.params.name;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only access your own orders"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            const order=await Product.find({_id:{$in:user.orders}});
            const ordersWithImages=order.map((product)=>({
                ...product.toObject(),
                imageUrl:product.imageData && product.imageContentType
                    ?`data:${product.imageContentType};base64,${product.imageData.toString("base64")}`
                    :null
            }));
            res.status(200).json(ordersWithImages);
        }
    }
    catch(error){
        res.status(500).json({message:"Error fetching orders",error:error.message});
    }
});

routes.get("/:name/wishlist",authUser,async (req,res)=>{
    const userName=req.params.name;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only access your own wishlist"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            const wishlist=await Product.find({_id:{$in:user.wishlist}});
            const wishlistWithImages=wishlist.map((product)=>({
                ...product.toObject(),
                imageUrl:product.imageData && product.imageContentType
                    ?`data:${product.imageContentType};base64,${product.imageData.toString("base64")}`
                    :null
            }));
            res.status(200).json(wishlistWithImages);
        }
    }
    catch(error){
        res.status(500).json({message:"Error fetching wishlist",error:error.message});
    }
})

routes.post("/:name/addedProducts",authUser,async (req,res)=>{
    const userName=req.params.name;
    const {productId}=req.body;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only access your own products"});
        }
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        if(!productId){
            return res.status(400).json({message:"Product ID is required"});
        }
        if(user.addedProducts.includes(productId)){
            return res.status(200).json({message:"Product already in your products"});
        }
        user.addedProducts.push(productId);
        await user.save();
        res.status(200).json({message:"Product added to your products"});
    }
    catch(error){
        res.status(500).json({message:"Error adding product",error:error.message});
    }
})

routes.get("/:name/addedProducts",authUser,async (req,res)=>{
    const userName=req.params.name;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only access your own products"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
           const addedProducts=await Product.find({_id:{$in:user.addedProducts}});
           const productsWithImages=addedProducts.map((product)=>({
            ...product.toObject(),
            imageUrl:product.imageData && product.imageContentType
                ?`data:${product.imageContentType};base64,${product.imageData.toString("base64")}`
                :null
        }));
            res.status(200).json(productsWithImages);
        }
    }
    catch(error){
        res.status(500).json({message:"Error fetching products",error:error.message});
    }
})

routes.delete("/:name/deleteProduct",authUser,async (req,res)=>{
    const userName=req.params.name;
    const {productId}=req.body;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only delete your own products"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        if(!productId){
            return res.status(400).json({message:"Product ID is required"});
        }

        const deletedProduct=await Product.findById(productId);
        if(!deletedProduct){
            return res.status(404).json({message:"Product not found"});
        }

        if(deletedProduct.owner.toString()!==user._id.toString()){
            return res.status(403).json({message:"Forbidden: You can only delete your own products"});
        }

        await Product.deleteOne({_id:productId});
        await User.updateMany(
            {},
            {
                $pull:{
                    addedProducts:productId,
                    orders:productId,
                    wishlist:productId
                }
            }
        );
        res.status(200).json({message:"Product deleted successfully"});
    }
    catch(error){
        res.status(500).json({message:"Error deleting product",error:error.message});
    }
})

routes.post("/:name/products/responses",authUser,async (req,res)=>{
    const {productId}=req.body;
    try{
        if(!productId){
            return res.status(400).json({message:"Product ID is required"});
        }
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        const owner=await User.findById(product.owner);
        if(!owner){
            return res.status(404).json({message:"Owner not found"});
        }
        const orderedUser=await User.findById(req.id);
        if(!orderedUser){
            return res.status(404).json({message:"Ordered user not found"});
        }
        owner.responses.push({
            productId,
            from:orderedUser._id,
            message:`${orderedUser.name} has ordered your product "${product.name}". Contact them at ${orderedUser.contact}.`
        });
        await owner.save();
        res.status(200).json({message:"Response sent to product owner"});
    }
    catch(error){
        res.status(500).json({message:"Error sending response",error:error.message});
    }
})

routes.get("/:name/responses",authUser,async (req,res)=>{
    const userName=req.params.name;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only access your own responses"});
        }
        if(!user){
            res.status(404).json({message:"User Not Found"});
        }
        else{
            const validResponses=user.responses.filter((response)=>response && response.from && response.productId);
            const responsesWithDetails=await Promise.all(validResponses.map(async (response)=>{
                const fromUser=await User.findById(response.from);
                const product=await Product.findById(response.productId);
                const fallbackDate=response?._id
                    ? new Date(parseInt(response._id.toString().substring(0,8),16) * 1000)
                    : new Date();
                return {
                    ...response.toObject(),
                    fromName:fromUser ? fromUser.name : "Unknown User",
                    productName:product ? product.name : "Unknown Product",
                    message:response.message || `${fromUser ? fromUser.name : "A user"} ordered ${product ? product.name : "your product"}.`,
                    receivedAt:response.receivedAt || fallbackDate
                }
            }));
            responsesWithDetails.sort((a,b)=>new Date(b.receivedAt)-new Date(a.receivedAt));
            res.status(200).json(responsesWithDetails);
        }
    }
    catch(error){
        res.status(500).json({message:"Error fetching responses",error:error.message});
    }
})

routes.patch("/:name/products/:id",authUser,upload.single("image"),async (req,res)=>{
    const userName=req.params.name;
    const productId=req.params.id;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only edit your own products"});
        }
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product Not Found"});
        }
        if(product.owner.toString()!==user._id.toString()){
            return res.status(403).json({message:"Forbidden: You can only edit your own products"});
        }
        const {
            name,
            description,
            price,
            category,
            bid,
            ownerType,
            ownerName,
            ownerEmail,
            ownerPhone,
            ownerAddress
        }=req.body;
        if(name) 
            product.name=name;
        if(description) 
            product.description=description;
        if(price) 
            product.price=price;
        if(category) 
            product.category=category;
        if(bid) 
            product.bid=bid;
        if(ownerType) 
            product.ownerType=ownerType;
        if(ownerName) 
            product.ownerName=ownerName;
        if(ownerEmail) 
            product.ownerEmail=ownerEmail;
        if(ownerPhone) 
            product.ownerPhone=ownerPhone;
        if(ownerAddress) 
            product.ownerAddress=ownerAddress;
        if(req.file){
            product.imageData=req.file.buffer;
            product.imageContentType=req.file.mimetype;
        }
        await product.save();
        res.status(200).json({message:"Product updated successfully",product});
    }
    catch(error){
        res.status(500).json({message:"Error updating product",error:error.message});
    }
})

export default routes;