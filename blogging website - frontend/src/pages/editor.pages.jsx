import { useContext, useState } from "react";
import { userContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import { createContext } from "react";
import PublishForm from "../components/publish-form.component";

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


    let { userAuth: { access_token} } = useContext(userContext);

    return (
        <editorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {
                access_token === null ? <Navigate to="/signin" /> : editorState === "editor" ? <BlogEditor /> : <PublishForm />
            }
        </editorContext.Provider>
    )
}

export default Editor;