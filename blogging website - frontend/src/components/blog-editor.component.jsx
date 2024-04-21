import { Link } from "react-router-dom"
import Logo  from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import BlogBanner from "../imgs/blog banner.png"

const BlogEditor = () => {
    
    const handleBannerUpload = (e) => {
        const img = e.target.files[0];
        console.log(img);
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
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img src={BlogBanner} alt="blogbanner" className="z-20" />
                                <input type="file" id="uploadBanner" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />
                            </label>
                        </div>
                    </div>
                </section>    
            </AnimationWrapper>      
        </>
    )
}

export default BlogEditor;