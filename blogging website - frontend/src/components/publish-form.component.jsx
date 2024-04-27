import { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { editorContext } from "../pages/editor.pages";

const PublishForm = () => {

    let { blog, blog:{ title, banner, tags, desc, content}, setBlog, textEditor, setTextEditor, editorState, setEditorState } = useContext(editorContext);
    let {  } = useContext(editorContext);
    const characterLimit =200;


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
            ></textarea>
          </div>
        </section>
      </AnimationWrapper>
    );
}

export default PublishForm;