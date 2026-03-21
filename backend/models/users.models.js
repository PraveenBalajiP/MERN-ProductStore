import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        unique:true
    }],
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        unique:true
    }],
    addedProducts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        unique:true
    }],
    responses:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        from:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        message:{
            type:String,
            required:true
        },
        receivedAt:{
            type:Date,
            default:Date.now
        }
    }]
},{timestamps:true});

const User=mongoose.model("User",userSchema);

export default User;