import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom"

const BlogPage = () =>  {

    let { blogId } = useParams();

    const fetchBlog = () => {
      const context = "/get-blog";
      axios
        .post(import.meta.env.VITE_SERVER_CONTEXT + context, { blogId })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    useEffect(() => {
        fetchBlog();
    }, []);
    return (
        <>This is a blog page- {blogId}</>
    )
}

export default BlogPage