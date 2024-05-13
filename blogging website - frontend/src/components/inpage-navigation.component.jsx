import React, { useState } from 'react'

const [ inPageNaveIndex, setInPageNaveIndex] = useState(0);

const InpageNavigation = ({ Routes }) => {
  return (
    <>
      <div className='relative mb-8 border-b border-grey flex flex-nowrap overflow-x-auto'>
        {Routes.map((route, i) => (
          <button key={i} className={'p-4 px-5 capitalize ' (inPageNaveIndex == i ? "text-black" : "text-grey")}>{route}</button>
        ))}
      </div>
    </>
  );
}

export default InpageNavigation