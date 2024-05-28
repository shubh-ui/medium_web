import React, { useState } from "react";
import { useParams } from "react-router-dom";

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
  return <div>ProfilePage - {profileId}</div>;
};

export default ProfilePage;
