import React from "react";
import { getDay } from "../common/date";
import {Link} from "react-router-dom"


const BlogPostCard = ({content, author}) => {
  let {
    title,
    banner,
    des,
    tags,
    publishedAt,
    activity: { total_likes },
    blog_id: id,
  } = content;

  let { fullname, profile_img, username } = author;

  return (
    <Link to="/" className="flex">
      <div className="w-full">
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
        <h1 className="blog-title">{title}</h1>
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px] line-clamp-2">
          {des}
        </p>
        <div className="flex items-center gap-4 mt-7">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl"></i>
            {total_likes}
          </span>
        </div>
      </div>
      <div className="h-28 aspect-square bg-grey">
        <img src={banner} alt="blog_baner" />
      </div>
    </Link>
  );
}

export default BlogPostCard;