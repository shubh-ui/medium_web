import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";

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
  const [ blog, setBlog ] = useState(blogStructure);
  const [ loading, setLoading ] = useState(true);

  let {
    title,
    content,
    banner,
    tags,
    publishedAt,
    blog_id,
    des,
    author: {
      personal_info: { username:author_username, fullname, profile_img },
    },
  } = blog;

  const fetchBlog = () => {
    const context = "/get-blog";
    axios
      .post(import.meta.env.VITE_SERVER_CONTEXT + context, { blogId })
      .then(({ data: { blog } }) => {
        console.log(blog);
        setBlog(blog);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);

      });
  };
  useEffect(() => {
    fetchBlog();
  }, []);
  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
       <section>
         <div className="max-w[900px] center py-10 max-lg:px-[5vw]">
          <img src={banner} alt="blog_img" className="aspect-video" />
          <div className="mt-12">
              <h2>{ title }</h2>  
              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                    <img src={profile_img} className="w-12 h-12 rounded-full" alt="profiel_img" />
                    <div className="flex flex-col">
                    <p className="capitalize">{fullname}</p>
                    <div>
                        @
                    <Link to={`/user/${author_username}`} className="underline">{author_username}</Link>

                    </div>
                    </div>
                </div>

              </div>
          </div>
        </div>
       </section>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage