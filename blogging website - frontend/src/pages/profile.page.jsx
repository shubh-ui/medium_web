import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/loader.component";
import { userContext } from "../App";
import AboutUser from "../components/about.component";

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
      .then(({ data }) => {
        console.log(data);
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    resetState();
    fetchUserProfile();
  }, [profileId]);

  const resetState = () => {
    setProfile(profileDataStructure);
    setLoading(true);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
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
            <AboutUser className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />

          </div>
        </section>
      )}
    </>
  );
};

export default ProfilePage;
