import { useContext } from "react";
import { userContext } from "../App";
import { Navigate } from "react-router-dom";

const Editor = () => {

    let { userAuth: { access_token} } = useContext(userContext);

    return (
        access_token === null ? <Navigate to="/signin" /> : <h1>You can access the editor page</h1>
    )
}

export default Editor;