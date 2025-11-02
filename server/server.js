import express from "express";
import "dotenv/config";
import { connectDB } from "./DB/Dbconfig.js";

// Import only v2 from cloudinary
import { v2 as cloudinaryV2 } from 'cloudinary';

import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoutes.js";

const PORT =  3000;

const server = express();

server.use(express.json());
server.use('/api', blogRoutes);
server.use('/api', authRoutes);
server.use('/api', userRoutes);

connectDB();

server.get("/", (req, res) => {
    console.log("Home route hit");
    res.send("Home Route")
})


cloudinaryV2.config({
    cloud_name: 'dwmaqqlj9',
    api_key: '851522418552728',
    api_secret: 'SdVxrJtRH4r33fvHSPRCHwJ6Oms'
});

server.listen(PORT, () => {
    console.log("listning on Port: ", PORT);
})