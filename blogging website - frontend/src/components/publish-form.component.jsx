import { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { editorContext } from "../pages/editor.pages";

const PublishForm = () => {

    let { setEditorState } = useContext(editorContext);
    let { blog: {banner, title, desc} } = useContext(editorContext);


    const handleCloseEvent = () => {
        setEditorState("editor");
    }
    return (
      <AnimationWrapper>
        <section>
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
            <h1 className="text-4xl font-medium-2 mt-2 leading-tight line-clamp-2">{title}</h1>
            <p className="font-gelasio line-clamp-2">{desc}</p>
          </div>
        </section>
      </AnimationWrapper>
    );
}

export default PublishForm;