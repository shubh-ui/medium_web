import { nanoid } from "nanoid";
import cloudinary from 'cloudinary';


import blogs from "../Schema/Blog.js"

export const fetchLatestBlogs =  (req, res) => {
    let maxLimit = 5;
    let { page } = req.body;

    blogs.find({ draft: false })
        .populate("author", "personal_info.fullname personal_info.profile_img personal_info.username -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(blogs => {
            return res.status(200).json({ blogs });
        }).catch(err => {
            return res.status(500).json({ error: err.massage });
        })

}


export const fetchLatestBlogCount = (req, res) => {
    blogs.countDocuments({ draft: false })
        .then((count) => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch(err => {
            return res.status(500).json({ Error: err.massage });
        })
}


export const fetchTrendingBlogs = (req, res) => {
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
}

export const searchBlogs = async (req, res) => {
    let { tag, page, author, query, limit, eliminate_blog } = req.body;
    let maxLimit = limit ? limit : 5;
    let findQuery;
    if (tag) {
        findQuery = { tags: tag, draft: false, blog_id: {$ne: eliminate_blog} };
    } 
    else if(author){
        findQuery = { author: author, draft: false };
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
  }

  export const searchBlogCount = (req, res) => {
    let { tag ,query, author } = req.body;
    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false };
    }
    else if (author) {
        findQuery = { author: author, draft: false };
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
}


export const createBlog = (req, res) => {
    // console.log(req.body);
    let autherId = req.user;
    console.log(req.user);

    let { title, des, tags, banner, content, draft, id } = req.body;

    if (title == undefined || !title?.length) {
        return res.status(404).json({ error: "You must provide a blog title to publish blog." })
    }

    if (des == undefined || !des?.length) {
        return res.status(404).json({ error: "You must provide a blog des to publish blog." })
    }

    if (tags == undefined || !tags?.length) {
        return res.status(404).json({ error: "You must provide a blog tags to publish blog." })
    }

    if (banner == undefined || !banner?.length) {
        return res.status(404).json({ error: "You must provide a blog banner to publish blog." })
    }

    if (content == undefined || !content?.blocks?.length) {
        return res.status(404).json({ error: "You must provide a blog content to publish blog." })
    }

    tags = tags.map(tag => tag.toLowerCase());

    let blogId = id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();
    console.log(blogId);

    if (id) {
        blogs.findOneAndUpdate({ blog_id: blogId }, { title, des, banner, tags, content, draft: draft ? draft : false })
            .then(blog => {
                return res.status(200).json(blog);
            })
            .catch(err => {
                return res.status(500).json({ Error: err.message });
            })
    }
    else {
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
    }

}


export const getBlog = (req, res) => {
    let { blogId, draft, mode } = req.body;

    let incrementVal = mode !== "edit" ? 1 : 0;

    blogs.findOneAndUpdate({ blog_id: blogId }, { $inc: { "activity.total_reads": incrementVal } })
        .populate("author", "personal_info.username personal_info.fullname personal_info.profile_img")
        .select("title des banner content tags activity publishedAt blog_id")
        .then(blog => {
            User.findOneAndUpdate({ "personal_info.username": blog.author.personal_info.username }, { $inc: { "account_info.total_reads": incrementVal } })
                .catch(err => {
                    return res.status(500).json({ Eoor: err.message });
                })
            if(blog.draft && !draft){
                return res.status(500).json({Eroor: "You can not access a draft blogs"});
            }
            return res.status(200).json({ blog });
        })
        .catch(err => {
            return res.status(500).json({ Error: err.message });
        })
}

export const likeBlog = (req, res) => {
    let user_id = req.user;

    let { _id, isLikedByUser } = req.body;

    let incrementVal = !isLikedByUser ? 1 : -1;

    blogs.findOneAndUpdate({_id }, {$inc : { "activity.total_likes" : incrementVal}})
    .then(blog => {

        if(!isLikedByUser) {
            let like = new Notification({
                type: "like",
                blog: _id,
                notification_for: blog.author,
                user: user_id
            })
            
            like.save().then(notification => {
                return res.status(200).json({Like_by_user: true});
            })
            .catch(err => {
                return res.status(500).json({Error: err.message});
            })
        }
        else {
            Notification.findOneAndDelete({ user: user_id , type: "like", blog: _id})
            .then((result) => {
                return res.status(200).json({Like_by_user: false});
            })
            .catch(err => {
                return res.status(500).json({Error: err.message});
            })
        }
    })
}

export const imageUpload = (req, res) => {
    cloudinaryV2.uploader.upload(req.file.path, (error, result) => {
        if (error) {
            console.error('Error uploading image:', error);
            return res.status(500).send('Error uploading image.');
        }
        res.json({ imageUrl: result.secure_url });
    });
}