import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/users.models.js';
import Product from '../models/products.models.js';
import Contact from '../models/contact.models.js';
import Feedback from '../models/feedback.models.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authUser from '../middleware/authUser.js';
import multer from 'multer';

dotenv.config();

const routes=express.Router();
const upload=multer({storage:multer.memoryStorage()});
const badUserIndexNames=["responses_1","wishlist_1","orders_1","addedProducts_1","acceptedDeals_1","pastDeals_1"];
let userIndexesNormalized=false;

async function normalizeUserIndexes(force=false){
    if(userIndexesNormalized && !force) return;
    try{
        const indexes=await User.collection.indexes();
        for(const indexName of badUserIndexNames){
            const exists=indexes.some((index)=>index.name===indexName);
            if(exists){
                await User.collection.dropIndex(indexName);
                console.log(`Dropped invalid users index from route layer: ${indexName}`);
            }
        }
        userIndexesNormalized=true;
    }
    catch(error){
        console.error("User index normalization warning:",error?.message || error);
    }
}

async function saveUserWithIndexRecovery(userDoc){
    try{
        await userDoc.save();
    }
    catch(error){
        if(error?.name==="ValidationError"){
            await userDoc.save({validateBeforeSave:false});
            return;
        }
        if(error?.code===11000){
            await normalizeUserIndexes(true);
            try{
                await userDoc.save();
            }
            catch(retryError){
                if(retryError?.name==="ValidationError"){
                    await userDoc.save({validateBeforeSave:false});
                    return;
                }
                throw retryError;
            }
            return;
        }
        throw error;
    }
}

async function pushOwnerResponseWithRecovery(ownerId,responsePayload){
    try{
        const exists=await User.exists({
            _id:ownerId,
            responses:{
                $elemMatch:{
                    productId:responsePayload.productId,
                    from:responsePayload.from
                }
            }
        });
        if(exists) return {inserted:false,reason:"already-exists"};

        const updateResult=await User.updateOne(
            {_id:ownerId},
            {$push:{responses:responsePayload}}
        );

        if(updateResult.matchedCount===0){
            return {inserted:false,reason:"owner-not-found"};
        }

        return {inserted:true,reason:"inserted"};
    }
    catch(error){
        if(error?.code===11000){
            await normalizeUserIndexes(true);
            const retryResult=await User.updateOne(
                {_id:ownerId},
                {$push:{responses:responsePayload}}
            );
            if(retryResult.matchedCount===0){
                return {inserted:false,reason:"owner-not-found"};
            }
            return {inserted:true,reason:"inserted-after-recovery"};
        }
        throw error;
    }
}

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
    const {name,email,phone,password,address}=req.body;

    const normalizedEmail=String(email || "").trim().toLowerCase();
    const normalizedPhone=String(phone || "").trim();

    if(!name || !normalizedEmail || !normalizedPhone || !password || !address){
        return res.status(400).json({message:"Name, email, phone, password and address are required"});
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const userData={
        name,
        email:normalizedEmail,
        phone:normalizedPhone,
        contact:normalizedEmail,
        password:hashedPassword,
        address
    };

    const savedData=new User(userData);
    console.log(savedData);
    try{
        const existingUser=await User.findOne({
            $or:[
                {email:normalizedEmail},
                {phone:normalizedPhone},
                {contact:normalizedEmail}
            ]
        });
        if(existingUser){
            res.status(400).json({message:"User already exists with this email or phone"});
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

routes.get("/signup",async (req,res)=>{
    try{
        const users=await User.find({},"email phone contact");
        return res.status(200).json(users);
    }
    catch(error){
        return res.status(500).json({message:"Error fetching users",error:error.message});
    }
})

routes.post("/login",async (req,res)=>{
    const {contact,password}=req.body;
    const normalizedContact=String(contact || "").trim().toLowerCase();
    const user=await User.findOne({
        $or:[
            {contact:normalizedContact},
            {email:normalizedContact},
            {phone:String(contact || "").trim()}
        ]
    });
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
                    contact:user.contact || user.email || user.phone,
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
            return res.status(404).json({message:"User Not Found"});
        }
        else{
            res.status(200).json({name:user.name,contact:user.contact || user.email || user.phone});
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
                email:user.email || (user.contact && user.contact.includes("@") ? user.contact : ""),
                phone:user.phone || (user.contact && user.contact.match(/^\d{10}$/) ? user.contact : ""),
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
        const numericPrice=Number(price);
        const normalizedBidMode=bid === "bid" ? "bid" : "fixed value";
        const newProduct=new Product({
            name,
            description,
            price:numericPrice,
            category,
            bid:normalizedBidMode,
            highestBid:normalizedBidMode === "bid" ? numericPrice : null,
            lowestBid:normalizedBidMode === "bid" ? numericPrice : null,
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
        try{
            const hasProduct=user.addedProducts.some((id)=>String(id)===String(newProduct._id));
            if(!hasProduct){
                user.addedProducts.push(newProduct._id);
                await user.save();
            }
        }
        catch(linkError){
            console.error("Failed to link product to user.addedProducts:",linkError?.message || linkError);
        }
        res.status(201).json({message:"Product added successfully",productId:newProduct._id});
    }
    catch(error){
        res.status(500).json({message:"Error adding product",error:error.message});
    }
})

routes.get("/:name/products",authUser,async (req,res)=>{
    try{
        const products=await Product.find({dealStatus:{ $ne:"sold" }});
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
            return res.status(404).json({message:"User Not Found"});
        }
        else{
            const alreadyInWishlist=user.wishlist.some((id)=>id.toString()===String(productId));
            if(alreadyInWishlist){
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
            return res.status(404).json({message:"User Not Found"});
        }
        else{
            user.wishlist=user.wishlist.filter((id)=>id.toString()!==String(productId));
            await user.save();
            res.status(200).json({message:"Product removed from wishlist"});
        }
    }
    catch(error){
        res.status(500).json({message:"Error modifying wishlist",error:error.message});
    }
})

routes.post("/:name/orders/add",authUser,async (req,res)=>{
    const {productId,bidValue}=req.body;
    try{
        await normalizeUserIndexes();
        const user=await User.findById(req.id);
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        if(!productId){
            return res.status(400).json({message:"Product ID is required"});
        }

        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }

        if(String(product.owner)===String(user._id)){
            return res.status(400).json({message:"You cannot order your own product"});
        }

        const alreadyInOrders=user.orders.some((id)=>String(id)===String(productId));
        if(alreadyInOrders){
            return res.status(400).json({message:"Product already in orders"});
        }

        let normalizedBidValue=null;
        if(product.bid === "bid"){
            normalizedBidValue=Number(bidValue);
            if(Number.isNaN(normalizedBidValue) || normalizedBidValue <= 0){
                return res.status(400).json({message:"Valid bid value is required for bidding products"});
            }
            product.bidHistory.push({user:user._id,amount:normalizedBidValue});
            product.highestBid=product.highestBid===null ? normalizedBidValue : Math.max(Number(product.highestBid),normalizedBidValue);
            product.lowestBid=product.lowestBid===null ? normalizedBidValue : Math.min(Number(product.lowestBid),normalizedBidValue);
            await product.save();
        }

        user.orders.push(productId);
        await saveUserWithIndexRecovery(user);

        const ownerResponsePayload={
            productId,
            from:user._id,
            fromName:user.name || "",
            fromContact:user.email || user.phone || user.contact || "",
            message:product.bid === "bid"
                ? `${user.name} has placed a bid of $${normalizedBidValue} on your product "${product.name}". Contact: ${user.email || user.contact || "N/A"}${user.phone ? `, ${user.phone}` : ""}.`
                : `${user.name} has ordered your product "${product.name}". Contact: ${user.email || user.contact || "N/A"}${user.phone ? `, ${user.phone}` : ""}.`,
            bidValue:product.bid === "bid" ? normalizedBidValue : null
        };

        const ownerResponseResult=await pushOwnerResponseWithRecovery(product.owner,ownerResponsePayload);
        if(ownerResponseResult.reason==="owner-not-found"){
            return res.status(200).json({message:"Product added to orders, but owner account was not found for response update."});
        }

        return res.status(200).json({message:"Product added to orders and owner notified"});
    }
    catch(error){
        res.status(500).json({message:"Error modifying orders",error:error.message});
    }
})

routes.post("/:name/orders/remove",authUser,async (req,res)=>{
    const {productId}=req.body;
    try{
        const user=await User.findById(req.id);
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        else{
            const existsInOrders=user.orders.some((id)=>String(id)===String(productId));
            if(!existsInOrders){
                return res.status(400).json({message:"Product not in orders"});
            }
            user.orders=user.orders.filter((id)=>String(id)!==String(productId));
            await user.save();
            res.status(200).json({message:"Product removed from orders"});
        }
    }
    catch(error){
        res.status(500).json({message:"Error modifying orders",error:error.message});
    }
})

routes.get("/:name/orders",authUser,async (req,res)=>{
    try{
        const user=await User.findById(req.id);
        if(!user){
            return res.status(404).json({message:"User Not Found"});
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
            return res.status(404).json({message:"User Not Found"});
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
            return res.status(404).json({message:"User Not Found"});
        }
        else{
            let addedProducts=[];

            if(Array.isArray(user.addedProducts) && user.addedProducts.length>0){
                addedProducts=await Product.find({_id:{$in:user.addedProducts}});
            }

            if(!addedProducts.length){
                addedProducts=await Product.find({owner:user._id});

                if(addedProducts.length){
                    try{
                        user.addedProducts=addedProducts.map((product)=>product._id);
                        await user.save();
                    }
                    catch(backfillError){
                        console.error("Failed to backfill user.addedProducts:",backfillError?.message || backfillError);
                    }
                }
            }

            const productsWithImages=addedProducts.map((product)=>(
                {
                    ...product.toObject(),
                    imageUrl:product.imageData && product.imageContentType
                        ?`data:${product.imageContentType};base64,${product.imageData.toString("base64")}`
                        :null
                }
            ));

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
            return res.status(404).json({message:"User Not Found"});
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
    const {productId,bidValue}=req.body;
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
        let normalizedBidValue=null;
        if(product.bid === "bid"){
            normalizedBidValue=Number(bidValue);
            if(Number.isNaN(normalizedBidValue) || normalizedBidValue <= 0){
                return res.status(400).json({message:"Valid bid value is required for bidding products"});
            }
            product.bidHistory.push({user:orderedUser._id,amount:normalizedBidValue});
            product.highestBid=product.highestBid===null ? normalizedBidValue : Math.max(Number(product.highestBid),normalizedBidValue);
            product.lowestBid=product.lowestBid===null ? normalizedBidValue : Math.min(Number(product.lowestBid),normalizedBidValue);
            await product.save();
        }
        const ownerResponsePayload={
            productId,
            from:orderedUser._id,
            fromName:orderedUser.name || "",
            fromContact:orderedUser.email || orderedUser.phone || orderedUser.contact || "",
            message:product.bid === "bid"
                ? `${orderedUser.name} has placed a bid of $${normalizedBidValue} on your product "${product.name}". Contact them at ${orderedUser.contact}.`
                : `${orderedUser.name} has ordered your product "${product.name}". Contact them at ${orderedUser.contact}.`,
            bidValue:product.bid === "bid" ? normalizedBidValue : null
        };
        const ownerResponseResult=await pushOwnerResponseWithRecovery(product.owner,ownerResponsePayload);
        if(ownerResponseResult.reason==="already-exists"){
            return res.status(200).json({message:"Response already recorded"});
        }
        if(ownerResponseResult.reason==="owner-not-found"){
            return res.status(404).json({message:"Owner not found"});
        }
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
            return res.status(404).json({message:"User Not Found"});
        }
        else{
            const validResponses=user.responses.filter((response)=>response && response.from && response.productId);
            const responsesWithDetails=await Promise.all(validResponses.map(async (response)=>{
                const fromUser=await User.findById(response.from);
                const product=await Product.findById(response.productId);
                const fallbackDate=response?._id
                    ? new Date(parseInt(response._id.toString().substring(0,8),16) * 1000)
                    : new Date();
                const resolvedFromName=response.fromName || (fromUser ? fromUser.name : "Unknown User");
                const resolvedFromContact=response.fromContact || fromUser?.email || fromUser?.phone || fromUser?.contact || "";
                return {
                    ...response.toObject(),
                    fromName:resolvedFromName,
                    fromContact:resolvedFromContact,
                    productName:product ? product.name : "Unknown Product",
                    message:response.message || `${resolvedFromName || "A user"} ordered ${product ? product.name : "your product"}.`,
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
        const normalizedBidMode=bid === "bid" ? "bid" : "fixed value";
        if(name) 
            product.name=name;
        if(description) 
            product.description=description;
        if(price) 
            product.price=price;
        if(category) 
            product.category=category;
        product.bid=normalizedBidMode;
        if(product.bid === "fixed value"){
            product.highestBid=null;
            product.lowestBid=null;
            product.bidHistory=[];
        }
        else if(product.bid === "bid" && product.bidHistory.length===0){
            const baselineBid=Number(product.price);
            product.highestBid=baselineBid;
            product.lowestBid=baselineBid;
        }
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

routes.post("/:name/:productId/acceptDeal",authUser,async (req,res)=>{
    const productId=req.params.productId;
    const {fromUserId} = req.body;
    try{
        await normalizeUserIndexes();
        const fromUserIdString=String(fromUserId || "");
        if(!fromUserIdString){
            return res.status(400).json({message:"Buyer id is required"});
        }

        const owner=await User.findById(req.id);
        if(!owner){
            return res.status(404).json({message:"Owner not found"});
        }
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        if(product.owner.toString()!==owner._id.toString()){
            return res.status(403).json({message:"Forbidden: You can only accept deals for your own products"});
        }
        if(product.dealStatus === "sold"){
            return res.status(400).json({message:"Deal has already been closed for this product"});
        }
        const responseIndex=owner.responses.findIndex(
            r=>String(r.productId)===String(productId) && String(r.from)===fromUserIdString
        );
        if(responseIndex===-1){
            return res.status(404).json({message:"Response not found"});
        }
        const response=owner.responses[responseIndex];
        const dealValue=response.bidValue || product.price;
        owner.acceptedDeals.push({
            productId:product._id,
            withUser:fromUserIdString,
            dealValue:dealValue
        });
        owner.responses.splice(responseIndex,1);
        await saveUserWithIndexRecovery(owner);
        const buyer=await User.findById(fromUserIdString);
        if(buyer){
            buyer.acceptedDeals.push({
                productId:product._id,
                withUser:owner._id,
                dealValue:dealValue
            });
            await saveUserWithIndexRecovery(buyer);
        }
        product.dealStatus="pending";
        await product.save();
        res.status(200).json({message:"Deal accepted successfully"});
    }
    catch(error){
        console.error("acceptDeal failure:",error);
        res.status(500).json({message:error?.message || "Error accepting deal"});
    }
})

routes.post("/:name/:productId/closeDeal",authUser,async (req,res)=>{
    const productId=req.params.productId;
    try{
        await normalizeUserIndexes();
        const owner=await User.findById(req.id);
        if(!owner){
            return res.status(404).json({message:"Owner not found"});
        }
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        if(product.owner.toString()!==owner._id.toString()){
            return res.status(403).json({message:"Forbidden: You can only close deals for your own products"});
        }
        const acceptedDealIndex=owner.acceptedDeals.findIndex(
            d=>d.productId.toString()===productId
        );
        if(acceptedDealIndex===-1){
            return res.status(404).json({message:"No accepted deal found for this product"});
        }
        const acceptedDeal=owner.acceptedDeals[acceptedDealIndex];
        const buyer=await User.findById(acceptedDeal.withUser);
        owner.pastDeals.push({
            productId:product._id,
            withUser:acceptedDeal.withUser,
            dealValue:acceptedDeal.dealValue
        });
        owner.acceptedDeals.splice(acceptedDealIndex,1);
        await saveUserWithIndexRecovery(owner);
        if(buyer){
            const buyerAcceptedDealIndex=buyer.acceptedDeals.findIndex(
                d=>d.productId.toString()===productId
            );
            if(buyerAcceptedDealIndex!==-1){
                const buyerAcceptedDeal=buyer.acceptedDeals[buyerAcceptedDealIndex];
                buyer.pastDeals.push({
                    productId:product._id,
                    withUser:owner._id,
                    dealValue:buyerAcceptedDeal.dealValue
                });
                buyer.acceptedDeals.splice(buyerAcceptedDealIndex,1);
                await saveUserWithIndexRecovery(buyer);
            }
        }
        product.dealStatus="sold";
        await product.save();
        res.status(200).json({message:"Deal closed successfully"});
    }
    catch(error){
        console.error("closeDeal failure:",error);
        res.status(500).json({message:error?.message || "Error closing deal"});
    }
})

routes.get("/:name/acceptedDeals",authUser,async (req,res)=>{
    const userName=req.params.name;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only access your own accepted deals"});
        }
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const dealsWithDetails=await Promise.all(user.acceptedDeals.map(async (deal)=>{
            const withUser=await User.findById(deal.withUser);
            const product=await Product.findById(deal.productId);
            return {
                ...deal.toObject(),
                withUserName:withUser ? withUser.name : "Unknown User",
                productName:product ? product.name : "Unknown Product",
                productDescription:product ? product.description : ""
            }
        }));
        res.status(200).json(dealsWithDetails);
    }
    catch(error){
        res.status(500).json({message:"Error fetching accepted deals",error:error.message});
    }
})

routes.get("/:name/pastDeals",authUser,async (req,res)=>{
    const userName=req.params.name;
    try{
        const user=await User.findById(req.id);
        if(user && user.name.toLowerCase()!==userName.toLowerCase()){
            return res.status(403).json({message:"Forbidden: You can only access your own past deals"});
        }
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const dealsWithDetails=await Promise.all(user.pastDeals.map(async (deal)=>{
            const withUser=await User.findById(deal.withUser);
            const product=await Product.findById(deal.productId);
            return {
                ...deal.toObject(),
                withUserName:withUser ? withUser.name : "Unknown User",
                productName:product ? product.name : "Unknown Product",
                productDescription:product ? product.description : ""
            }
        }));
        dealsWithDetails.sort((a,b)=>new Date(b.dealDate)-new Date(a.dealDate));
        res.status(200).json(dealsWithDetails);
    }
    catch(error){
        res.status(500).json({message:"Error fetching past deals",error:error.message});
    }
})

routes.post("/:name/feedback",authUser,async (req,res)=>{
    const userName=req.params.name;
    const {type,rating,title,message}=req.body;
    try{
        const feedback=new Feedback({
            user:req.id,
            type:type || "Nil",
            rating:rating || "0",
            title:title || "No Title",
            message:message || "",
        })
        await feedback.save();
        res.status(201).json({message:"Feedback submitted successfully"});
    }
    catch(error){
        res.status(500).json({message:"Error submitting feedback",error:error.message});
    }
})

routes.post("/:name/contact",authUser,async (req,res)=>{
    const userName=req.params.name;
    const {name,email,subject,message}=req.body;
    try{
        const contact=new Contact({
            user:req.id,
            name:name || "Anonymous",
            email:email || "",
            subject:subject || "No Subject",
            message:message || ""
    })
    await contact.save();
    res.status(201).json({message:"Contact message submitted successfully"});
    }
    catch(error){
        res.status(500).json({message:"Error submitting contact message",error:error.message});
    }
})

export default routes;