import React from "react";
import { useParams } from "react-router-dom";
import InpageNavigation from "../components/inpage-navigation.component";

const SearchPage = () => {
  let { query } = useParams();

  return (
    <>
      <section className="flex items-center gap-10">
        <div className="w-full">
          <InpageNavigation Routes={[`search result for "${query}"`, "account matched"]} defaultHidden={["account matched"]} />
        </div>
      </section>
    </>
  )
};

export default SearchPage;
