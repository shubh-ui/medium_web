import { Link } from "react-router-dom"
import Logo  from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import BlogBanner from "../imgs/blog banner.png"

const BlogEditor = () => {
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

               
        </>
    )
}

export default BlogEditor;