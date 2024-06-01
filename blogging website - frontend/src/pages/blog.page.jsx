import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export const blogStructure = {
  title: "",
  content: "",
  banner: "",
  tags: [],
  publishedAt: "",
  des: "",
  author: { personal_info: { username: "", fullname: "", profile_img: "" } },
};

const BlogPage = () => {
  let { blogId } = useParams();
  const [blog, setBlog] = useState(blogStructure);

  let {
    title,
    content,
    banner,
    tags,
    publishedAt,
    blog_id,
    des,
    author: {
      personal_info: { username, fullname, profile_img },
    },
  } = blog;

  const fetchBlog = () => {
    const context = "/get-blog";
    axios
      .post(import.meta.env.VITE_SERVER_CONTEXT + context, { blogId })
      .then(({ data: { blog } }) => {
        console.log(blog);
        setBlog(blog);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchBlog();
  }, []);
  return <>This is a blog page- {blogId}</>;
};

export default BlogPage