import React, { useContext, useEffect } from "react";
import { blogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog: {
      _id,
      blog_id,
      activity: { total_likes, total_comments },
      activity,
      author: {
        personal_info
        : { username: author_username },
    },
    title
    },
    blog,
    isLikedByUser,
    setLikedByUser,
    setBlog,
    setCommentsWrapper
  } = useContext(blogContext);

  useEffect(() => {
    if (access_token) {
      let context = "/isLiked-by-user";
      axios
        .post(
          import.meta.env.VITE_SERVER_CONTEXT + context,
          {
            _id,
          },
          {
            headers: {
              Authorization: `bearer ${access_token}`,
            },
          }
        )
        .then(({ data }) => {
          // console.log(data);
          setLikedByUser(Boolean(data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  let {userAuth: {username, access_token}} = useContext(userContext);

  const handleLikeBlog = () => {
    let context = "/like-blog"
    if(access_token){
      setLikedByUser(preVal => !preVal);
      !isLikedByUser ? total_likes++ : total_likes--;

      setBlog({...blog, activity:{...activity, total_likes}});

      axios.post(import.meta.env.VITE_SERVER_CONTEXT + context, {
        _id,
        isLikedByUser
      }, {
        headers:{
          Authorization: `bearer ${access_token}`
        }
      })
      .then(({data}) => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      })
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

            <button className={"w-10 h-10 rounded-full flex items-center justify-center " + (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")}
              onClick={handleLikeBlog}
            >
            <i className={"fi " + ( isLikedByUser ? "fi-sr-heart" : "fi-rr-heart" )}></i>
            </button>
            <p className="text-xl text-dark-grey">{total_likes}</p>

            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
              onClick={() => setCommentsWrapper(preVal => !preVal)}
            >
            <i className="fi fi-rr-comment-dots"></i>
            </button>
            <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-3 items-center">
            {
              username == author_username ? <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : ""
            }
            <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} target="_blank"><i className="fi fi-brands-twitter text-xl hover:text-twitter"></i></Link>
        </div>
  
     </div>
     <hr className="border-grey my-2" />

    </>
  );
};

export default BlogInteraction;
