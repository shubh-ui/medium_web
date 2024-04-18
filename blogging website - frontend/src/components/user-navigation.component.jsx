import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import { Link } from 'react-router-dom'
import { userContext } from '../App'

const UserNavigationPanel = () => {

    const {userAuth:{username}} = useContext(userContext)

  return (
    <AnimationWrapper transition={{ duration: 0.2 }}
        className="absolute right-0 z-50"
    >
      <div className="bg-whilte absolute right-0 border border-gray w-60 duration-200">
        <Link to="/editor" className="flex gap-2 link md:hiidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <p>write</p>
        </Link>

        <Link to={`/user/${username}`} className='link pl-8 py-4'>
            Profile
        </Link>

        
        <Link to="/dashboards/blogs" className='link pl-8 py-4'>
            Dashboard
        </Link>

        <Link to="/settings/edit-profile" className='link pl-8 py-4'>
            Settings
        </Link>


        <span className='absolute border-top border-gray w-[100%]'></span>

      </div>
    </AnimationWrapper>
  );
}

export default UserNavigationPanel