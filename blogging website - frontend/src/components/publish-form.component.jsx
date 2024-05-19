import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext, useState } from "react";
import { editorContext } from "../pages/editor.pages";
import Tags from "./tags.component";
import axios from "axios";
import { userContext } from "../App";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {

    let {
      blog,
      blog: { title, banner, tags, des, content },
      setBlog,
      textEditor,
      setTextEditor,
      editorState,
      setEditorState,
    } = useContext(editorContext);
    let {} = useContext(editorContext);
    const [userAuth, setUserAuth] = useState({});
    let { userAuth: { access_token } } = useContext(userContext);
    const characterLimit = 200;
    const tagLimit = 10;
    const context = import.meta.env.VITE_SERVER_CONTEXT;

    const navigate = useNavigate();


    const handleCloseEvent = () => {
        setEditorState("editor");
    }

    const handleBlogTitleChange = (e) => {
        let input = e.target;
        setBlog({ ...blog , title: input.value})
    }

    const handleBlogDescriptionChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, des: input.value})
    }

    const handleTitileKeyDown = (e) => {
        if(e.keyCode == 13) { //Enter Key
            e.preventDefault();
        }
    }

    const handleKeyDown = (e) => {
      if(e.keyCode == 13 || e.keyCode == 188) {
        
        let tag = e.target.value;
        if(tags?.length < tagLimit) {
          if(!tags.includes(tag) && tag?.length) {
            setBlog({ ...blog, tags: [...tags, tag]})
          }
        }
        else{
          toast.error(`You can add maximum ${tagLimit} tags`)
        }
        e.target.value ="";
      }
    }

    const bublishBlog = (e) => {

      const urlCd = "/create-blog";

      if(e.target.className.includes("disable")){
        return;
      }

      if(!title.length) {
        return toast.error("You must provide a blog title to publish a blog.")
      }
      if(!des.length || des.length > characterLimit) {
        return toast.error("You must provide a blog description to publish a blog")
      }
      if(!tags.length) {
        return toast.error("You must provide a tags to rank your blog.")
      }

      let loading = toast.loading("Loading...");

      e.target.classList.add("disable");

      let blogObj = {
        title, des, banner, tags, content, draft:false
      }

      axios
        .post(context + urlCd, blogObj, {
          headers: {
            Authorization: `bearer ${access_token}`,
          },
        })
        .then(() => {
          e.target.classList.remove("disable");
          toast.dismiss(loading);
          toast.success("Published...");

          setTimeout(() => {
            navigate("/");
          },500)
        })
        .catch(({ responce }) => {
          e.target.classList.remove("disable");
          toast.dismiss(loading);
          toast.error("Error during publishing blog");
          console.log(responce.data.error)
        });

    }
    
    return (
      <AnimationWrapper>
        <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
          <Toaster />

          <button
            className="w-12 h-12 right-[5vw] absolute z-10 top-[5%] lg:top-[10%]"
            onClick={handleCloseEvent}
          >
            <i className="fi fi-br-cross"></i>
          </button>

          <div className="max-w-[550px] center">
            <p className="text-dark-grey mb-1 text-xl">Preview</p>
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
              <img src={banner} alt="" />
            </div>
            <h1 className="text-4xl font-medium-2 mt-2 leading-tight line-clamp-2">
              {title}
            </h1>
            <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
              {des}
            </p>
          </div>

          <div className="border-grey lg:border-1 lg:pl-8">
            <h1 className="to-dark-grey mb-2 mt-9">Blog Title</h1>
            <input
              className="input-box pl-4"
              type="text"
              placeholder="Blog Title"
              defaultValue={title}
              onChange={handleBlogTitleChange}
            />

            <h1 className="to-dark-grey mb-2 mt-9">
              Short description about your blog.
            </h1>
            <textarea
              className="h-40 input-box leading-7 resize-none pl-4"
              name="blog-des"
              defaultValue={des}
              maxLength={characterLimit}
              onChange={handleBlogDescriptionChange}
              onKeyDown={handleTitileKeyDown}
            ></textarea>
            <p className="mt-1 text-dark-grey text-sm text-right">
              {characterLimit - des.length} Characters left
            </p>

            <h1 className="mt-1 text-dark-grey text-sm">
              Tags - (Helps to search and rank the blog){" "}
            </h1>

            <div className="relative input-box pl-2 pr-2 pb-4">
              <input
                type="text"
                placeholder="Topic"
                className="sticky input-box bg-white top-0 left-0 pl-4 pb-3 focus:bg-white"
                onKeyDown={handleKeyDown}
              />

              {tags.map((tag, i) => (
                <Tags tag={tag} key={i} />
              ))}
            </div>
            <p className="mt-1 mb-4 text-dark-grey text-sm text-right">
                {tagLimit - tags.length} Tags left
              </p>

              <button className="btn-dark px-8" onClick={bublishBlog}>Publish</button>
          </div>
        </section>
      </AnimationWrapper>
    );
}

export default PublishForm;