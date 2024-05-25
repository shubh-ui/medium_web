import React from "react";
import pageNotFound from "../imgs/404.png";
import fullLogo from "../imgs/full-logo.png"
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <section className="relative flex p-10 flex-col items-center gap-20 text-center">
      <img
        src={pageNotFound}
        alt="pagenotfound"
        className="select-none bottom-2 border-grey w-72 aspect-square object-cover rounded"
      />
      <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
      <p className="text-dark-grey text-xl leading-7 -mt-8" >The page you are looking for does not exist.Head back to the <Link to={"/"} className="text-black underline">Home</Link> page</p>

      <div className="mt-20">
        <img src={fullLogo} alt="logo" className="h-8 object-contain block select-none mx-auto"/>
        <p className="mt-5 text-dark-grey">Read millions of stories around the world.</p>
      </div>
    </section>
  );
};

export default PageNotFound;
