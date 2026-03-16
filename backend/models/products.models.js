import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    }
},{timestamps:true});

const Product=new mongoose.model("Product",productSchema);
export default Product;