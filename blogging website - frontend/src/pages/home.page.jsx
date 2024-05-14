import React from 'react'
import InpageNavigation from '../components/inpage-navigation.component'

const Home = () => {
  return (
    <>
      <div className='flex items-center justify-center gap-10'>

        {/* latest blog.. */}
        <div className='w-full'>
           <InpageNavigation Routes={['Home', 'Trending Blogs']} />
        </div>

        {/* trending blogs */}
        <div>

        </div>

      </div>
    </>
  )
}

export default Home