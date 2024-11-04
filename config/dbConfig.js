import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const connectDb = async () => {
    try {
       
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
        return connection;
    } catch (error) {
        console.error('Error in connecting to MongoDB:', error.message); 
        process.exit(1); 
    }
};

export default connectDb;
