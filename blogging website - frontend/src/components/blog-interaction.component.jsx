import React, { useContext } from "react";
import { blogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { Toaster, toast } from "react-hot-toast";

const BlogInteraction = () => {
  let {
    blog: {
      blog_id,
      activity: { total_likes, total_comments },
      author: {
        personal_info
        : { username: author_username },
    },
    title
    },
    isLikedByUser,
    setIsLikedByUser
  } = useContext(blogContext);

  let {userAuth: {username, access_token}} = useContext(userContext);

  const handleLikeBlog = () => {
    if(access_token){

    }
    else{
      toast.error("Please login to like this blog.")
    }
  }


  return (
    <>
     <Toaster />
     <hr className="border-grey my-2" />
     <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">

            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
              onClick={handleLikeBlog}
            >
            <i className="fi fi-rr-heart"></i>
            </button>
            <p className="text-xl text-dark-grey">{total_likes}</p>

            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-comment-dots"></i>
            </button>
            <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-3 items-center">
            {
              username == author_username ? <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : ""
            }
            <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}><i className="fi fi-brands-twitter text-xl hover:text-twitter"></i></Link>
        </div>
  
     </div>
     <hr className="border-grey my-2" />

    </>
  );
};

export default BlogInteraction;
