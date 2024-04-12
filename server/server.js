import express from "express";
import mogoose from "mongoose"
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

import User from "./Schema/User.js";

const server = express();

server.use(express.json());

const PORT =  3000;

mogoose.connect(process.env.DB_LOCATION, {
    autoIndex:true
})

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


const generateUsername = async (email) => {
    let username = email.split("@")[0];

    const isUsernameExist = await User.exists({ "personal_info.username": username }).then(user => user);
    //    console.log(isUsernameExist);
    isUsernameExist ? username += nanoid().substring(0, 5) : "";
    return username;
}

const formatDataToSend = (user) => {

    const access_token = jwt.sign({id:user._id},process.env.SECRET_ACCESS_KEY)
    return {
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
        access_token
    }
}

server.post("/api/signup", (req, res) => {

    let { fullname, email, password } = req.body;

    if (fullname.length < 3) {
        return res.status(400).json({ "Error ": "Fullname must be atleast three character" });
    }
    if (!email.length) {
        return res.status(400).json({ "Error ": "Enter email" });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ "Error": "Email is invalid" });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ "Error": "Password should be atleast 6 to 8 characters long with one lovercase,one uppercase and one numeric" })
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        // let username = email.split("@")[0];

        let username = await generateUsername(email);
        // console.log(username);

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        })

        user.save().then((u) => {
            return res.status(200).json(formatDataToSend(u));
        }).catch(err => {
            if (err.code == 11000) {
                return res.status(400).json({ "Error": "Email is already exist" })
            }
            return res.status(500).json({ "Error ": err.message })
        })
    })




    // return res.status(200).json({ "success": "data sent successfuly" });
})

server.listen(PORT, () => {
    console.log("listning on Port: ",PORT);
})