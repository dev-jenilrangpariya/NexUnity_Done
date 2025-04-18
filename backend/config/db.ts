import mongoose, { MongooseError } from "mongoose";

const connectDB = async () => {
    try {
        // Attempting to connect to the MongoDB database using the provided URL
        const conn = await mongoose.connect(process.env.MONGO_URL);

        // Logging a success message if the connection is established
        console.log(`Connected to MongoDB on host ${conn.connection.host}`);
    } catch (error: any) {
        // Logging an error message if the connection fails
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
};

export default connectDB;