import React from "react";
import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MininamBlogPost = ({ blog, author, index }) => {
  const { blog_id: id, publishedAt, title } = blog;
  const { fullname, profile_img, username } = author;
  return (
    <Link to={`blog/${id}`} className="flex gap-4 mb-8">
      <h1 className="blog-index">
        {index < 10 ? "0" + (index + 1) : index + 1}
      </h1>

      <div>
        <div className="flex items-center gap-2 mb-7">
          <img
            src={profile_img}
            alt="profile_pic"
            className="w-6 h-6 rounded-full"
          />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{ title }</h1>
      </div>
    </Link>
  );
};

export default MininamBlogPost;
