import React, { useContext, useState } from "react";
import { userContext } from "../App";
import toast, { Toaster } from "react-hot-toast";

const CommentField = ({action}) => {
  const [comment, setComment] = useState("");

  let { userAuth: { access_token } } = useContext(userContext);

  const handleComment = () => {
    if(!access_token) {
      return toast.error("Login is required to leave a comment");
    }
  }
  return (
    <>
      <Toaster />
      <textarea value={comment} placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <button className="btn-dark mt-5 px-10"
        onClick={handleComment}
      >{action}</button>
    </>
  );
};

export default CommentField;
