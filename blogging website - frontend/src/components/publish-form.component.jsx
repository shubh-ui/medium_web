import { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { editorContext } from "../pages/editor.pages";
import Tags from "./tags.component";

const PublishForm = () => {

    let { blog, blog:{ title, banner, tags, desc, content}, setBlog, textEditor, setTextEditor, editorState, setEditorState } = useContext(editorContext);
    let {  } = useContext(editorContext);
    const characterLimit =200;
    const tagLimit = 10;


    const handleCloseEvent = () => {
        setEditorState("editor");
    }

    const handleBlogTitleChange = (e) => {
        let input = e.target;
        setBlog({ ...blog , title: input.value})
    }

    const handleBlogDescriptionChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, desc: input.value})
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
          e.target.value ="";
        }
      }
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
            <p className="text-dark-grey mb-1">Preview</p>
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
              <img src={banner} alt="" />
            </div>
            <h1 className="text-4xl font-medium-2 mt-2 leading-tight line-clamp-2">
              {title}
            </h1>
            <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
              {desc}
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
              name="blog-desc"
              defaultValue={desc}
              maxLength={characterLimit}
              onChange={handleBlogDescriptionChange}
              onKeyDown={handleTitileKeyDown}
            ></textarea>
            <p className="mt-1 text-dark-grey text-sm text-right">
              {characterLimit - desc.length} Characters left
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

              {
                tags.map((tag, i)=> (
                  <Tags tag={tag} key={i} />
                ))
              }

            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
}

export default PublishForm;