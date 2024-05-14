import React, { useState } from 'react'

const InpageNavigation = ({ Routes }) => {
  const [ inPageNaveIndex, setInPageNaveIndex] = useState(0);

  return (
    <>
      <div className='relative mb-8 border-b bg-white border-grey flex flex-nowrap overflow-x-auto'>
        {Routes.map((route, i) => 
          {
            return <button key={i} className= {'p-4 px-5 capitalize '+ (inPageNaveIndex == i ? "text-black" : "text-grey")}>{route}</button>
          }
        )}
      </div>
    </>
  );
}

export default InpageNavigation