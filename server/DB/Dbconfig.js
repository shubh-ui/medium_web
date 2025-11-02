import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // console.log("Mongo URI", process.env.DB_LOCATION);
        
        // Ensure the environment variable is set
        if (!process.env.DB_LOCATION) {
            throw new Error("DB_LOCATION is not set in environment variables");
        }

        // Connect to the MongoDB database
        await mongoose.connect(process.env.DB_LOCATION, {
            autoIndex: true,
        });

        console.log("Mongo DB Connected");
    } catch (error) {
        console.error("Error while connecting to DB:", error.message);
        // In case you're using Express, send a response back
        // res.status(500).send("Error while connecting to the database");
    }
};
