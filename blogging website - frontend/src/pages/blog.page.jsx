import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";

export const blogStructure = {
  title: "",
  content: "",
  banner: "",
  tags: [],
  publishedAt: "",
  des: "",
  author: { personal_info: { username: "", fullname: "", profile_img: "" } },
};
export const  blogContext = createContext({})

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
            <blogContext.Provider value={{ blog, setBlog}}>
              <div className="mt-12">
                <h2>{title}</h2>
                <div className="flex max-sm:flex-col justify-between my-8">
                  <div className="flex gap-5 items-start">
                    <img
                      src={profile_img}
                      className="w-12 h-12 rounded-full"
                      alt="profiel_img"
                    />
                    <div className="flex flex-col">
                      <p className="capitalize">{fullname}</p>
                      <div>
                        @
                        <Link
                          to={`/user/${author_username}`}
                          className="underline"
                        >
                          {author_username}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                    Published On {getDay(publishedAt)}
                  </p>
                </div>
              </div>
              <BlogInteraction />

            </blogContext.Provider>
          </div>
        </section>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage