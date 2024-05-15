import React, { useEffect, useState } from 'react'
import InpageNavigation from '../components/inpage-navigation.component'
import AnimationWrapper from '../common/page-animation'
import axios from "axios";
import Loader from '../components/loader.component';
import BlogPostCard from '../components/blog-post.component';


const Home = () => {
  const [blogs, setBlogs] = useState(null);

  const fetchLatestBlogs = () => {
    const context = "/api";
    const urlCd = "/latest-blogs";
    axios
      .get(context + urlCd)
      .then(({ data }) => {
        setBlogs(data.blogs);
      })
      .catch((err) => console.error(err.massage));
  };

  useEffect(()=> {
    fetchLatestBlogs();
  },[])

  return (
    <AnimationWrapper>
      <section className="flex items-center justify-center gap-10">
        {/* latest blog.. */}
        <div className="w-full">
          <InpageNavigation
            Routes={["Home", "Trending Blogs"]}
            defaultHidden={["Trending Blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogPostCard content={blog} author={blog.author.personal_info} />
                    </AnimationWrapper>
                  );
                })
              )}
            </>
          </InpageNavigation>
        </div>

        {/* trending blogs */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
}

export default Home