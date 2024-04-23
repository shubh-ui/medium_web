import { useContext, useState } from "react";
import { userContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
// import { createContext } from "react";

const blogStructure = {
    title:'',
    banner:'',
    content:[],
    tags:[],
    desc:'',
    auther:{ personal_info:{ } }
}


    let { userAuth: { access_token} } = useContext(userContext);

    return (
        access_token === null ? <Navigate to="/signin" /> : editorState === "editor" ? <BlogEditor /> : <h1>Publish form</h1>
    )

export default Editor;