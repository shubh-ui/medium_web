import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InpageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataComponent from "../components/nodata.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const SearchPage = () => {
  let { query } = useParams();
  const [blogs, setBlogs] = useState(null);

  const [users, setUsers] = useState(null);
  

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

  const fetchUsers = () => {
    axios.post(import.meta.env.VITE_SERVER_CONTEXT + '/search-users', {query})
    .then(({data}) => {
      if(data){
        setUsers(data);
      }
    })
  }

  useEffect(() => {
    resetState()
    searchblogs({ page: 1,create_new_obj:true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  }

  return (
    <>
      <section>
        {
          <h1 className="max-h-[52px] tracking-[-0.011em] leading-[52px] text-[42px] font-medium mt-8">
            <span className="opacity-60 max-h-[52px] tracking-[-0.011em] leading-[52px] text-[42px] font-medium">
              Results for
            </span>{" "}
            {query}
          </h1>
        }
      </section>
      <section className="flex items-center gap-10">
        <div className="w-full">
          <InpageNavigation
            Routes={[`story`, "account matched"]}
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
              <LoadMoreDataBtn state={blogs} fetchDataFun={searchblogs} />
            </>
          </InpageNavigation>
        </div>
      </section>
    </>
  );
};

export default SearchPage;
