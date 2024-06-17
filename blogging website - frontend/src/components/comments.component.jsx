import React, { useContext } from 'react'
import { blogContext } from '../pages/blog.page';

const CommentsComponent = () => {

    let { commentsWrapper, setCommentsWrapper } = useContext(blogContext);
  return (
    <div className={"max-sm:w-full fixed " + ( commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"}>
      CommentsComponent
    </div>
  );
}

export default CommentsComponent