import { useContext, useEffect, useState } from "react";
import { userContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import { createContext } from "react";
import PublishForm from "../components/publish-form.component";
import Loader from "../components/loader.component";
import axios from "axios";

const blogStructure = {
    title:'',
    banner:'',
    content:[],
    tags:[],
    des:'',
    auther:{ personal_info:{ } }
}

export const editorContext = createContext({ });

const Editor = () => {

    let { blog_id } = useParams();
    console.log("Blog_Id" , blog_id);

    const [editorState, setEditorState] = useState("editor");
    const [blog, setBlog] = useState(blogStructure);
    const [textEditor, setTextEditor] = useState({ isReady: false});
    const [loading, setLoading] = useState(true);


    let { userAuth: { access_token} } = useContext(userContext);

    useEffect(() => {
        if(!blog_id) {
            setLoading(false);
            return
        }
        fetchBLogForEdit();
    },[blog_id])

    const fetchBLogForEdit = () => {
        const endPointUrl ="/get-blog"
        axios.post(import.meta.env.VITE_SERVER_CONTEXT + endPointUrl,{
            blog_id,
            draft:true,
            mode:"edit"
        })
        .then(({data : { blog }}) => {
            setBlog(blog);
            setLoading(false);
        })
        .catch(err => {
            console.log(err.message);
            setLoading(false);
        })
    }

    return (
        <editorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {
                access_token === null ? <Navigate to="/signin" /> : loading ? <Loader /> : editorState === "editor" ? <BlogEditor /> : <PublishForm />
            }
        </editorContext.Provider>
    )
}

export default Editor;