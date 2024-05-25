import express from "express";
import mogoose from "mongoose"
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import multer from 'multer';
import cloudinary from 'cloudinary';
import blogs from "./Schema/Blog.js"

// Import only v2 from cloudinary
import { v2 as cloudinaryV2 } from 'cloudinary';

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

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)
    return {
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
        access_token
    }
}

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null || token == undefined) {
        return res.status(403).json({ error: "No access token" });
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if (err) {
            return res.status(404).json({ error: "Access token is invalid" });
        }

        req.user = user.id;
        next()
    })
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

server.post("/api/signin", (req, res) => {
    let { email, password } = req.body;

    // console.log(email)
    User.findOne({ "personal_info.email": email }).then(user => {

        // console.log(user)
        if (!user) {
            return res.status(403).json({ "Error": "Email not found" })
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

server.post('/api/latest-blogs', (req, res) => {
    let maxLImit = 5;
    let { page } = req.body;

    blogs.find({ draft: false })
        .populate("author", "personal_info.fullname personal_info.profile_img personal_info.username -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLImit)
        .limit(maxLImit)
        .then(blogs => {
            return res.status(200).json({ blogs });
        }).catch(err => {
            return res.status(500).json({ error: err.massage });
        })

})

server.post('/api/all-latest-blog-count', (req, res) => {
    blogs.countDocuments({ draft: false })
        .then((count) => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch(err => {
            return res.status(500).json({ Error: err.massage });
        })
})

server.get('/api/trending-blogs', (req, res) => {
    let maxLimit = 5;

    blogs.find({ draft: false })
        .populate("author", "personal_info.fullname personal_info.profile_img personal_info.username -_id")
        .sort({ "activity.total_likes": -1, "activity.total_reads": -1, "publishedAt": -1 })
        .select("blog_id title publishedAt -_id")
        .limit(maxLimit)
        .then(blogs => {
            return res.status(200).json({ blogs })
        })
        .catch(err => {
            return res.status(500).json({ error: err.massage })
        })
})

server.post('/api/search-blogs', async (req, res) => {
    let { tag, page, query } = req.body;
    let maxLimit = 5;
    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false };
    }
    else {
        findQuery = { draft: false, title: new RegExp(query, "i") }
    }
    // console.log(findQuery)
    try {
      const resultedBlogs = await blogs.find(findQuery)
        .populate("author", "personal_info.fullname personal_info.profile_img personal_info.username -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .exec();
  
      return res.status(200).json({ resultedBlogs });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
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

server.post('/api/search-blog-count', (req, res) => {
    let { tag ,query } = req.body;
    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false };
    }
    else {
        findQuery = { draft: false, title: new RegExp(query, "i") }
    }
    blogs.countDocuments(findQuery)
        .then((count) => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch(err => {
            return res.status(500).json({ Error: err.massage });
        })
})


server.post('/api/create-blog', verifyJWT, (req, res) => {
    // console.log(req.body);
    let autherId = req.user;
    console.log(req.user);

    let { title, des, tags, banner, content, draft } = req.body;

    if (title == undefined || !title.length) {
        return res.status(404).json({ error: "You must provide a blog title to publish blog." })
    }

    if (des == undefined || !des.length) {
        return res.status(404).json({ error: "You must provide a blog des to publish blog." })
    }

    if (tags == undefined || !tags.length) {
        return res.status(404).json({ error: "You must provide a blog tags to publish blog." })
    }

    if (banner == undefined || !banner.length) {
        return res.status(404).json({ error: "You must provide a blog banner to publish blog." })
    }

    if (content == undefined || !content.blocks.length) {
        return res.status(404).json({ error: "You must provide a blog content to publish blog." })
    }

    tags = tags.map(tag => tag.toLowerCase());

    let blogId = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();
    console.log(blogId);

    let blog = new blogs({
        title,
        des,
        banner,
        author: autherId,
        blog_id: blogId,
        tags,
        content,
        draft: Boolean(draft)
    });

    blog.save()
        .then((savedBlog) => {
            const incrementVal = draft ? 0 : 1;
            console.log(incrementVal);

            User.findOneAndUpdate(
                { _id: autherId },
                {
                    $inc: { "account_info.total_posts": incrementVal },
                    $push: { "blogs": savedBlog._id }
                }
            )
                .then((user) => {
                    console.log("User", user);
                    return res.status(201).json({ id: blog.blog_id });
                })
                .catch((err) => {
                    console.error("Error saving blog or updating user:", err);
                    return res.status(500).json({ Error: "Failed to save blog or update user" });
                });;
        })
        .catch(err => {
            return res.status(500).json({ Error: err.message });
        })

})

server.listen(PORT, () => {
    console.log("listning on Port: ", PORT);
})