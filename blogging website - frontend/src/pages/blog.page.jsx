import { useParams } from "react-router-dom"

const BlogPage = () =>  {

    let { blogId } = useParams();
    return (
        <>This is a blog page- {blogId}</>
    )
}

export default BlogPage