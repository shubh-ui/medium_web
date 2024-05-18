import React, { useEffect, useState } from 'react'
import InpageNavigation from '../components/inpage-navigation.component'
import AnimationWrapper from '../common/page-animation'
import axios from "axios";
import Loader from '../components/loader.component';
import BlogPostCard from '../components/blog-post.component';
import MininamBlogPost from '../components/nobanner-blog-post.component';


const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const categories = ["programing","hollywood","film making","social media", "cooking","tech","finances","travel"];


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

  
  const fetchTrendingBlogs = () => {
    const context = "/api";
    const urlCd = "/trending-blogs";
    axios
      .get(context + urlCd)
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => console.error(err.massage));
  };

  useEffect(()=> {
    fetchLatestBlogs();
    fetchTrendingBlogs();
  },[])

  return (
    <AnimationWrapper>
      <section className="flex justify-center gap-10">
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
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </>

            <>
              {trendingBlogs == null ? (
                <Loader />
              ) : (
                trendingBlogs.map((blog, i) => {
                  // {console.log(blog)}
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MininamBlogPost
                        blog={blog}
                        author={blog.author.personal_info}
                        index={i}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </>
          </InpageNavigation>
        </div>

        {/* trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
            <h1 className="font-medium text-xl mb-8">
              Stories from all interests
            </h1>
            <div className='flex gap-3 flex-wrap'>
                {
                  categories.map((category,i) => {
                      return <button className='tag' key={i}>
                          { category }
                      </button>
                  })
                }
            </div>
            </div>

          <div>
            <h1 className="font-medium text-xl mb-8">Trendings <i className="fi fi-rr-arrow-trend-up"></i></h1>
            
            <>
              {trendingBlogs == null ? (
                <Loader />
              ) : (
                trendingBlogs.map((blog, i) => {
                  // {console.log(blog)}
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MininamBlogPost
                        blog={blog}
                        author={blog.author.personal_info}
                        index={i}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </>
          </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
}

export default Home