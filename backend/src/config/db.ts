import mongoose from 'mongoose';
import config from './config';

const connectDB = async () => {
  try {
    const mongoURI = config.mongoUrl; // Get URI from environment variables
    if (!mongoURI) {
        console.error('MONGO_URI not defined in environment variables.');
        process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB; 