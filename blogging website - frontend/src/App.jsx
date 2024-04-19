import Navabar from "./components/navbar.component";
import { Routes, Route } from "react-router-dom"
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import EditorPage from "./pages/editor.pages";

export const userContext = createContext({});


const App = () => {

  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  },[]);


    return (
      <>
       <userContext.Provider value={{userAuth, setUserAuth}}>
       <Routes>
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/" element={<Navabar />}>
            <Route path="/signin" element={<UserAuthForm type="sign-in" />} />
            <Route path="/signup" element={<UserAuthForm type="sign-up" />} />
          </Route>
        </Routes>
       </userContext.Provider>
      </>
    );
}

export default App;