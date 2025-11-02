import express from "express";
import "dotenv/config";
import { connectDB } from "./DB/Dbconfig.js";

// Import only v2 from cloudinary
import { v2 as cloudinaryV2 } from 'cloudinary';

import User from "./Schema/User.js";
import Notification from "./Schema/Notification.js";
import { verifyJWT } from "./middleware/authMiddleware.js";
import blogRoutes from "./routes/blogRoutes.js"
import authRoutes from "./routes/authRoute.js"

const PORT =  3000;

const server = express();

server.use(express.json());
server.use('/api', blogRoutes);
server.use('/api', authRoutes);

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


server.post('/api/search-users', (req, res) => {
    let { query } = req.body;
    User.find({ "personal_info.username": new RegExp(query, "i") })
      .limit(50)
      .select({ personal_info: { username: 1, fullname: 1, profile_img: 1 } })
      .then(users => {
        return res.status(200).json(users);
      })
      .catch(err => {
        return res.status(500).json({ error: err.message });
      });
  });

server.post('/api/get-profile', (req, res) => {
    let { username } = req.body;
    // console.log(req.body)

    User.findOne({ "personal_info.username": username })
        .select("-personal_info.password -google_auth -blogs")
        .then(user => {
            return res.status(200).json( user )
        })
        .catch(err => {
            return res.status(500).json({ Error: err.message })
        })
})

server.post('/api/isLiked-by-user', verifyJWT, (req, res) => {
    let user_id = req.user;

    let { _id } = req.body;

    Notification.exists({ user: user_id , type: "like", blog: _id})
    .then((result) => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(500).json({Error: err.message});
    })
})

server.listen(PORT, () => {
    console.log("listning on Port: ", PORT);
})