import React from 'react'
import InpageNavigation from '../components/inpage-navigation.component'

const Home = () => {
  return (
    <>
      <div className='flex items-center justify-center'>

        <div>
           <InpageNavigation Routes={['Home', 'Trending Blogs']} />
        </div>

        <div>

        </div>

      </div>
    </>
  )
}

export default Home