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

const BlogEditor = () => {

    useEffect(() => {
        let editor = new EditorJs({
            holder:textEditor,
            data:'',
            tools:tools,
            placeholder:'Lets write an awesome story..'
        })
    },[])

    let { blog, blog:{ title, banner, tags, desc, content}, setBlog } = useContext(editorContext);

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

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex w-10">
                    <img src={Logo} alt="Homelogo" />
                </Link>

                <p className="max-md:hidden text-black w-full line-clamp-1">{ title.length ? title : "New Blog" }</p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2">
                        Publish
                    </button>

                    <button className="btn-light py-2">
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
                                     >

                                </textarea>
                                <div id="textEditor" className="font-galasio"></div>
                        </div>
                    </div>
                </section>    
            </AnimationWrapper>      
        </>
    )
}

export default BlogEditor;