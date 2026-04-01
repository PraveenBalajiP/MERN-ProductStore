
import express from 'express';
import connectDB from './db/connectDB.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

let frontendUrl = process.env.FRONTEND_BASEURL || 'http://localhost:5173';
if (frontendUrl && !frontendUrl.startsWith('http')) {
	frontendUrl = 'https://' + frontendUrl;
}

app.use(cors({
	origin: frontendUrl,
	credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection middleware for Serverless
let isConnected = false;
app.use(async (req, res, next) => {
	if (!isConnected) {
		try {
			await connectDB();
			isConnected = true;
		} catch (error) {
			console.error("Database connection failed:", error);
			return res.status(500).json({ message: "Database connection failed" });
		}
	}
	next();
});

app.use('/api/users', authRoutes);

app.get('/', (req, res) => {
	res.send('Product Store API backend is running');
});

export default function handler(req, res) {
  return app(req, res);
}