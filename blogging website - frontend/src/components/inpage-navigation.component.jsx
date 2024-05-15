import React, { useEffect, useRef, useState } from 'react'

const InpageNavigation = ({ Routes, defaultHidden = [], defaultActiveIndex = 0 , children}) => {
  const [ inPageNaveIndex, setInPageNaveIndex] = useState(defaultActiveIndex);
  const activeTabLineRef = useRef();
  const activeTabRef = useRef();

  const activeTabChange = (btn, i) => {
    const { offsetWidth, offsetLeft } = btn;
    // console.log(offsetWidth,offsetLeft)

    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";

    setInPageNaveIndex(i);

  }

  useEffect(()=> {
    activeTabChange(activeTabRef.current ,defaultActiveIndex);
  },[]);

  return (
    <>
      <div className='relative mb-8 border-b bg-white border-grey flex flex-nowrap overflow-x-auto'>
        {Routes.map((route, i) => 
          {
            return <button key={i} 
                      ref={i == defaultActiveIndex ? activeTabRef : null}
                      className= {'p-4 px-5 capitalize '+ (inPageNaveIndex == i ? "text-black" : "text-dark-grey") + (defaultHidden.includes(route) ? " md:hidden" : "")}
                      onClick={(e) => activeTabChange(e.target, i)}
                      >{route}</button>
          }
        )}

      <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300' />

      </div>

      { Array.isArray(children) ? children[inPageNaveIndex] : children }

    </>
  );
}

export default InpageNavigation