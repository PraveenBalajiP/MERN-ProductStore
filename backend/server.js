import express from 'express';
import connectDB from './db/connectDB.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app=express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT=process.env.PORT||5000;

app.use("/api/users",authRoutes);

app.listen(PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
    connectDB();
})