import express from "express";
import mogoose from "mongoose"
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import multer from 'multer';
import cloudinary from 'cloudinary';
import { connectDB } from "./DB/Dbconfig.js";

// Import only v2 from cloudinary
import { v2 as cloudinaryV2 } from 'cloudinary';

import User from "./Schema/User.js";
import Notification from "./Schema/Notification.js";
import { verifyJWT } from "./middleware/authMiddleware.js";
import blogRoutes from "./routes/blogRoutes.js"

const PORT =  3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const server = express();

server.use(express.json());
server.use('/api', blogRoutes);

connectDB();


const generateUsername = async (email) => {
    let username = email.split("@")[0];

    const isUsernameExist = await User.exists({ "personal_info.username": username }).then(user => user);
    //    console.log(isUsernameExist);
    isUsernameExist ? username += nanoid().substring(0, 5) : "";
    return username;
}

const formatDataToSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)
    return {
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
        access_token
    }
}



server.get("/", (req, res) => {
    console.log("Home route hit");
    res.send("Home Route")
})

server.post("/api/signup", async (req, res) => {

    const { fullname, email, password } = req.body;

    // Validate fullname length
    if (fullname.length < 3) {
        return res.status(400).json({ "Error": "Fullname must be at least three characters" });
    }

    // Validate email
    if (!email.length) {
        return res.status(400).json({ "Error": "Enter email" });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ "Error": "Email is invalid" });
    }

    // Validate password
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            "Error": "Password should be at least 6 to 8 characters long with one lowercase, one uppercase, and one numeric character"
        });
    }

    try {
        // Hash password
        const hashed_password = await bcrypt.hash(password, 10);

        // Generate a unique username
        let username = await generateUsername(email); 

        // Create user instance
        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        });

        // Save the user to the database
        await user.save();
        return res.status(200).json({ success: true, data: user });

    } catch (err) {
        // Check if it's a duplicate email error (MongoDB error code 11000 is for duplicate key)
        if (err.code === 11000) {
            return res.status(400).json({ "Error": "Email is already in use" });
        }

        console.log("Error occurred", err.message);
        return res.status(500).json({ "Error": err.message });
    }
});

server.post("/api/signin", (req, res) => {
    let { email, password } = req.body;

    // console.log(email)
    User.findOne({ "personal_info.email": email }).then(user => {

        // console.log(user)
        if (!user) {
            return res.status(403).json({ "Error": "Email not found" });
        }

        bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if (err) {
                return res.status(403).json({ "Error": "Error occured while logging Please try again.." });
            }
            if (!result) {
                return res.status(403).json({ "Error": "username or password wrong" });
            }
            else {
                return res.status(200).json(formatDataToSend(user));
            }
        })
        // return res.status(200).json({"status":"success, Got user doc",});

    }).catch(err => {
        return res.status(500).json({ "Error": err.message })
    })

})


cloudinaryV2.config({
    cloud_name: 'dwmaqqlj9',
    api_key: '851522418552728',
    api_secret: 'SdVxrJtRH4r33fvHSPRCHwJ6Oms'
});

const upload = multer({ dest: 'uploads/' });

server.post('/api/upload', upload.single('image'), (req, res) => {
    cloudinaryV2.uploader.upload(req.file.path, (error, result) => {
        if (error) {
            console.error('Error uploading image:', error);
            return res.status(500).send('Error uploading image.');
        }
        res.json({ imageUrl: result.secure_url });
    });
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