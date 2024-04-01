import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png"
import { Link } from "react-router-dom"
import AnimationWrapper from "../common/page-animation"
import { Toaster, toast} from "react-hot-toast"
import axios from "axios"
import { storeInSession } from "../common/session";

const UserAuthForm = ({ type }) => {

  const userAuthToServer = (serverRout, formData) => {
    const contex = "/api"
    axios.post( contex + serverRout, formData).then(({data}) => {
      console.log(data);
      storeInSession("user",JSON.stringify(data));
    })
    .catch(({response}) => {
      toast.error(response.data.Error);
      console.log(response)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const serverRout = type === "sign-up" ? "/signup" : "/signin";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    let form = new FormData(formElement);

    let formData = {};
    for (let [key, value] of form) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;
    if (type == "sign-up") {
      console.log("test")
      if (fullname.length < 3) {
        return toast.error("Fullname must be atleast three character");
      }
    }
    if (!email.length) {
      return toast.error("Enter email" );
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid" );
    }
    if (!passwordRegex.test(password)) {
      return toast.error("Password should be atleast 6 to 8 characters long with one lovercase,one uppercase and one numeric",);
    }
    console.log(formData);


    userAuthToServer(serverRout, formData);
  };

  
  return (
   <AnimationWrapper keyValue={type}>
     <Toaster />
     <section className="h-cover flex items-center justify-center">
      <form id="formElement" className="w-80 max-w-[400px]">
        <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
          {type === "sign-in" ? "Welcome-back" : "Join us today"}
        </h1>

        {type !== "sign-in" ? (
          <InputBox
            name="fullname"
            type="text"
            placeholder="Full Name"
            icon="fi-rr-user"
          />
        ) : (
          ""
        )}

        <InputBox
          name="email"
          type="email"
          placeholder="Email"
          icon="fi-rr-envelope"
        />

        <InputBox
          name="password"
          type="password"
          placeholder="Password"
          icon="fi-rr-key"
        />

        <button className="btn-dark center mt-14" type="submit" onClick={handleSubmit}>
          {type.replace("-", " ")}
        </button>

        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
          <hr className="w-1/2 border-black" />
          <p>or</p>
          <hr className="w-1/2 border-black" />
        </div>

        <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
          <img src={googleIcon} className="w-5" alt="googleicon" />
          continue with google
        </button>

        {type == "sign-in" ? (
          <p className="mt-6 text-dark-grey text-xl text-center">
            Dont't have an account ?
            <Link to="/signup"
              className="underline text-black text-xl ml-1"
            >
              Join us today.
            </Link>
          </p>
        ) : (
          <p className="mt-6 text-dark-grey text-xl text-center">
            Already a member ?
            <Link to="/signin"
              className="underline text-black text-xl ml-1"
            >
              Sign in here.
            </Link>
          </p>
        )}
      </form>
    </section>
  </AnimationWrapper>
  );
};

export default UserAuthForm;
