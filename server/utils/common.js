import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import User from "../Schema/User.js";


export const generateUsername = async (email) => {
    let username = email.split("@")[0];

    const isUsernameExist = await User.exists({ "personal_info.username": username }).then(user => user);
    //    console.log(isUsernameExist);
    isUsernameExist ? username += nanoid().substring(0, 5) : "";
    return username;
}

export const formatDataToSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)
    return {
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
        access_token
    }
}