import express from 'express';
import connectDB from './db/db.js';

const app=express();
const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
    connectDB();
})