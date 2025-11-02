import bcrypt from "bcrypt";

import { formatDataToSend, generateUsername } from "../utils/common.js";
import User from "../Schema/User.js";


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

export const signup = async (req, res) => {

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
}


export const signin = (req, res) => {
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

}