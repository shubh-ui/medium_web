import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InpageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataComponent from "../components/nodata.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";

const SearchPage = () => {
  let { query } = useParams();
  const [blogs, setBlogs] = useState(null);

  const searchblogs = ({ page = 1, create_new_obj = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_CONTEXT + "/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        console.log(data.resultedBlogs);
        // setBlogs(data.resultedBlogs);
        const formatedData = await filterPaginationData({
          state: blogs,
          data: data.resultedBlogs,
          page: page,
          countRoute: "/search-blog-count",
          create_new_obj,
          data_to_send: { query },
        });
        console.log(formatedData);
        setBlogs(formatedData);
      })
      .catch((err) => {
        confirm.log(err.massage);
      });
  };

  useEffect(() => {
    searchblogs({ page: 1 });
  }, [query]);

  return (
    <>
      <section className="flex items-center gap-10">
        <div className="w-full">
          <InpageNavigation
            Routes={[`search result for "${query}"`, "account matched"]}
            defaultHidden={["account matched"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
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
              ) : (
                <NoDataComponent message="No blogs found for this category..." />
              )}
              {/* <LoadMoreDataBtn state={blogs} fetchDataFun={pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory} /> */}
            </>
          </InpageNavigation>
        </div>
      </section>
    </>
  );
};

export default SearchPage;
