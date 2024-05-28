import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/loader.component";

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
    personal_info : { fullname, username, profile_img, bio },
    account_info: { totla_posts, total_reads },
    joinedAt,
  } = profile;

  const fetchUserProfile = () => {
    const context = "/get-profile";
    axios
      .post(import.meta.env.VITE_SERVER_CONTEXT + context, {
        username: profileId,
      })
      .then(({data}) => {
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
    fetchUserProfile();
  }, []);

  return (
    <>{loading ? <Loader /> : <div>{fullname}</div>}</>
  );
};

export default ProfilePage;
