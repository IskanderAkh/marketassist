import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectMongoDB from './db/connectMongoDB.js';
import authRoutes from './routes/auth.routes.js';
import apiKeyRoute from './routes/apiKey.routes.js';
import reviewsRouter from './routes/reviews.routes.js'
import reportRouter from './routes/report.routes.js'
import OpenAI from 'openai';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const WB_API_BASE_URL = 'https://feedbacks-api.wildberries.ru/api/v1';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewsRouter)
app.use('/api/report', reportRouter);
app.use('/api/user', apiKeyRoute)

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
  connectMongoDB();
});
