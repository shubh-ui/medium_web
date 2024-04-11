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



server.listen(PORT, () => {
    console.log("listning on Port: ",PORT);
})