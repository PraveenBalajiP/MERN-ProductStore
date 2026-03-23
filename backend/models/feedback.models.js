import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const contactSchema = new mongoose.Schema({
    type:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true,
        min: 1,
    },
    title:{
        type: String,
        required: true
    },
    message:{
        type:String,
        required:true
    }
},{timestamps:true})

const Feedback=new mongoose.model("Feedback",contactSchema)

export default Feedback;

