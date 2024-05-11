import { Link } from "react-router-dom"
import Logo  from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import BlogBanner from "../imgs/blog banner.png"
import { Toaster, toast} from "react-hot-toast"


import axios from "axios"
import { useContext, useEffect } from "react";
import { editorContext } from "../pages/editor.pages";
import EditorJs from "@editorjs/editorjs"
import { tools } from "./tools.component";
import { userContext } from "../App";

const BlogEditor = () => {

    let { blog, blog:{ title, banner, tags, des, content}, setBlog, textEditor, setTextEditor, editorState, setEditorState } = useContext(editorContext);
    let { userAuth:{ access_token} } = useContext(userContext);

    useEffect(() => {
        console.log(content);
        setTextEditor(new EditorJs({
            holder:text_Editor,
            data:content,
            tools:tools,
            placeholder:'Lets write an awesome story..'
        }))
    },[])


    // let blogBannerRef = useRef();
    const context = "/api";
    
    const handleBannerUpload = async (e) => {
        const img = e.target.files[0];
        console.log(img);
        if(img) {
            const toastId = toast.loading('Loading...');
            const urlCd = "/upload";
            const formData = new FormData();
            formData.append('image', img);
        
            try {
              const response = await axios.post(context + urlCd, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
              console.log(response)
              toast.dismiss(toastId);
              if(response.data.imageUrl){

                setBlog({ ...blog, banner:response.data.imageUrl})
                // blogBannerRef.current.src = response.data.imageUrl;

              }
            } catch (error) {
              console.error('Error :', error);
            }
        }
    } 

    const handleTitileKeyDown = (e) => {
        if(e.keyCode == 13) { //Enter Key
            e.preventDefault();
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px"

        setBlog({...blog, title:input.value})
    }

    const handleBannerError = (e) => {
        let img = e.target;
        img.src = BlogBanner;
    }

    const handlePublishEvent = () => {
        if(!banner.length) {
            return toast.error("Upload a blog banner to publish it.")
        }

        if(!title.length) {
            return toast.error("Write a blog title to publish it.")
        }
        

        if(textEditor.isReady || typeof textEditor.isReady == "object") {
            textEditor.save().then(data => {
                // console.log(data);
                if(data.blocks.length) {
                    setBlog({ ...blog, content: data});
                    setEditorState("publish");
                }
                else {
                    return toast.error("Write somthing in your blog to publish it.");
                }
            }).catch(err => {
                console.error(err);
            })
        }
    }

    const handleDraft = (e) => {
      const context = "/api";
      const urlCd = "/create-blog";

      if(e.target.className.includes("disable")){
        return;
      }

      if(!title.length) {
        return toast.error("You must provide a blog title to saving blog as a draft.");
      }

      let loading = toast.loading("Saving draft...");

      e.target.classList.add("disable");

      let blogObj = {
        title, des, banner, tags, content, draft:true
      }

      axios
        .post(context + urlCd, blogObj, {
          headers: {
            Authorization: access_token,
          },
        })
        .then(() => {
          e.target.classList.remove("disable");
          toast.dismiss(loading);
          toast.success("Saved...");

          setTimeout(() => {
            navigate("/");
          },500)
        })
        .catch(({ responce }) => {
          e.target.classList.remove("disable");
          toast.dismiss(loading);
          toast.error("Error during saving blog as a draft.");
          console.log(responce.data.error)
        });

    }

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex w-10">
                    <img src={Logo} alt="Homelogo" />
                </Link>

                <p className="max-md:hidden text-black w-full line-clamp-1">{ title.length ? title : "New Blog" }</p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2"
                      onClick={handlePublishEvent}
                    >
                        Publish
                    </button>

                    <button className="btn-light py-2"
                        onClick={handleDraft}
                    >
                        Save Draft
                    </button>
                </div>
            </nav>  

            <AnimationWrapper>
               <Toaster />
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img src={banner} onError={handleBannerError} alt="blog banner" className="z-20" />
                                <input type="file" id="uploadBanner" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />
                            </label>
                            <textarea
                                     className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                                     name="blog-title" id="blog-title" placeholder="Blog-Title"
                                     onKeyDown={handleTitileKeyDown}
                                     onChange={handleTitleChange}
                                     defaultValue={title}
                                     >

                                </textarea>
                                <div id="text_Editor" className="font-galasio"></div>
                        </div>
                    </div>
                </section>    
            </AnimationWrapper>      
        </>
    )
}

export default BlogEditor;