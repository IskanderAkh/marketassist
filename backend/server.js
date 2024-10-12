import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectMongoDB from './db/connectMongoDB.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import reviewsRouter from './routes/reviews.routes.js'
import apiKeyRouter from './routes/apiKey.routes.js'
import reportRouter from './routes/report.routes.js'
import plansRoutes from './routes/plans.routes.js'
import OpenAI from 'openai';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

const allowedOrigins = ['https://marketassist.ru', 'http://localhost:3000', 'http://marketassist.ru'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewsRouter)
app.use('/api/report', reportRouter);
app.use('/api/user', userRoutes)
app.use('/api/apiKey', apiKeyRouter)
app.use('/api/plans', plansRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })

}

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
  connectMongoDB();
});
