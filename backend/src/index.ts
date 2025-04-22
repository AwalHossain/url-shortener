import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import connectDB from './config/db';
// import urlRoutes from './routes/url';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(express.json());
app.use(cors());

// Routes
// app.use('/api', urlRoutes);

// Redirect route
app.get('/health', async (req: Request, res: Response) => {
  try {
    // check db status
        const db = mongoose.connection;
    if (db.readyState === 1) {
      res.status(200).json({ message: 'Server is running' }); 
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap();