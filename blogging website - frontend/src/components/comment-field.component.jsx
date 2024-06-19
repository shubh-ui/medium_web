import React, { useState } from "react";

const CommentField = () => {
  const [comment, setComment] = useState("");
  return (
    <>
      <textarea value={Comment} placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
    </>
  );
};

export default CommentField;
