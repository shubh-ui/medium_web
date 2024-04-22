import { Link } from "react-router-dom"
import Logo  from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import BlogBanner from "../imgs/blog banner.png"
import { Toaster, toast} from "react-hot-toast"


import axios from "axios"
import { useRef } from "react";

const BlogEditor = () => {

    let blogBannerRef = useRef();
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
              if(response){
                toast.dismiss(toastId);
                blogBannerRef.current.src = response.data.imageUrl;

              }
            } catch (error) {
              console.error('Error :', error);
            }
        }
    } 



    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex w-10">
                    <img src={Logo} alt="Homelogo" />
                </Link>

                <p className="max-md:hidden text-black w-full line-clamp-1">New Blog</p>

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
                                <img ref={blogBannerRef} src={BlogBanner} alt="blogbanner" className="z-20" />
                                <input type="file" id="uploadBanner" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />

                                <textarea
                                     className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                                     name="blog-title" id="blog-title" placeholder="Blog-Title"
                              
                                     >

                                </textarea>
                            </label>
                        </div>
                    </div>
                </section>    
            </AnimationWrapper>      
        </>
    )
}

export default BlogEditor;