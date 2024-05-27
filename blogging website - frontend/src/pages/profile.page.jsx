import React from 'react'
import { useParams } from 'react-router-dom'

const ProfilePage = () => {
    let {id: profileId } = useParams();
  return (
    <div>ProfilePage - { profileId }</div>
  )
}

export default ProfilePage