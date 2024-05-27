import React from "react";

const NoDataComponent = ({ message }) => {
  return (
    <div className="text-center w-full p-4 mt-4 bg-grey/50 rounded-full">
      {message}
    </div>
  );
};

export default NoDataComponent;
