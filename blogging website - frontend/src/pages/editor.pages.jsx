import { useContext, useState } from "react";
import { userContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import { createContext } from "react";

const blogStructure = {
    title:'',
    banner:'',
    content:[],
    tags:[],
    desc:'',
    auther:{ personal_info:{ } }
}

export const editorContext = createContext({ });

const Editor = () => {

    const [editorState, setEditorState] = useState("editor");
    const [blog, setBlog] = useState(blogStructure);

    let { userAuth: { access_token} } = useContext(userContext);

    return (
        <editorContext.Provider value={{ blog, setBlog, editorState, setEditorState }}>
            {
                access_token === null ? <BlogEditor /> : editorState === "editor" ? <BlogEditor /> : <h1>Publish form</h1>
            }
        </editorContext.Provider>
    )
}

export default Editor;