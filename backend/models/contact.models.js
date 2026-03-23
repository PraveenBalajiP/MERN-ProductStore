import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const contactSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  subject:{
    type:String,
    required:true
  },
  message:{
    type:String,
    required:true
  }
},{timestamps:true})

const Contact=new mongoose.model("Contact",contactSchema)

export default Contact;