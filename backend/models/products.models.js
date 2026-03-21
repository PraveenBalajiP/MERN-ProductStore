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
    },
    imageData:{
        type:Buffer
    },
    imageContentType:{
        type:String
    },
    imageUrl:{
        type:String,
        default:""
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    ownerType:{
        type:String,
        enum:["owner","agent"],
        default:"owner"
    },
    ownerDetails:{
        name:{
            type:String,
            default:""
        },
        email:{
            type:String,
            default:""
        },
        phone:{
            type:String,
            default:""
        },
        address:{
            type:String,
            default:""
        }
    }
},{timestamps:true});

const Product=new mongoose.model("Product",productSchema);
export default Product;