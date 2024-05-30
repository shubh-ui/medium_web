import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/loader.component";
import { userContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import NoDataComponent from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import LoadMoreDataBtn from "../components/load-more.component";
import InpageNavigation from "../components/inpage-navigation.component";
import PageNotFound from "./404.page";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    totla_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: "",
};

const ProfilePage = () => {
  let { id: profileId } = useParams();
  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);
  const [loadedProfile, setLoadedProfile] = useState("");

  let {
    userAuth: { username },
  } = useContext(userContext);

  let {
    personal_info: { fullname, username: profileName, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  const fetchUserProfile = () => {
    const context = "/get-profile";
    axios
      .post(import.meta.env.VITE_SERVER_CONTEXT + context, {
        username: profileId,
      })
      .then(({ data: user }) => {
        console.log(user);
        if(!!user){
          setProfile(user);
        }
        setLoadedProfile(profileId);
        getBlogs({ user_id: user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;

    axios
      .post(import.meta.env.VITE_SERVER_CONTEXT + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          data: data.resultedBlogs,
          state: blogs,
          page,
          countRoute: "/search-blog-count",
          data_to_send: { author: user_id },
        });

        formatedData.user_id = user_id;

        console.log("Formated Data from Profile page:", formatedData);
        setBlogs(formatedData);
      });
  };

  useEffect(() => {
    if (profileId !== loadedProfile) {
      setBlogs(null);
    }
    if (blogs == null) {
      resetState();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  const resetState = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setBlogs(null);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        profile.personal_info.username.length ?
        <section className="md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
            <img
              className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
              src={profile_img}
              alt="profile_img"
            />
            <h1 className="text-2xl font-medium">@{profileName}</h1>
            <p className="text-xl capitalize h-6">{fullname}</p>
            <p>
              {total_posts.toLocaleString()} Blogs -{" "}
              {total_reads.toLocaleString()} - Reads
            </p>

            <div className="flex gap-4 mt-2">
              {username === profileName ? (
                <Link
                  to="/settings/edit-profile"
                  className="btn-light rounded-md"
                >
                  Edit Profile
                </Link>
              ) : (
                ""
              )}
            </div>
            <AboutUser
              className="max-md:hidden"
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>
          <div className="max-md:mt-12 w-full">
            <InpageNavigation
              Routes={["Blogs Published", "About"]}
              defaultHidden={["About"]}
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
                <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} />
              </>

              <>
                <AboutUser
                  bio={bio}
                  social_links={social_links}
                  joinedAt={joinedAt}
                />
              </>
            </InpageNavigation>
          </div>
        </section> :
        <PageNotFound />
      )}
    </>
  );
};

export default ProfilePage;
