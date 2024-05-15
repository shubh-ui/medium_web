import React from 'react'
import InpageNavigation from '../components/inpage-navigation.component'
import AnimationWrapper from '../common/page-animation'

const Home = () => {
  return (
      <AnimationWrapper>
        <section className="flex items-center justify-center gap-10">
          {/* latest blog.. */}
          <div className="w-full">
            <InpageNavigation Routes={["Home", "Trending Blogs"]} defaultHidden={["Trending Blogs"]}>
              <h1>Latest Blogs Here</h1>
              <h1>Trending Blogs Here</h1>
            </InpageNavigation>
          </div>

          {/* trending blogs */}
          <div></div>
        </section>
      </AnimationWrapper>
  );
}

export default Home