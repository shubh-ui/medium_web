import React from 'react'

const Img = React.memo(({url, caption}) => {
    console.log(url);
    return (
        <div>
            <img src={url} alt="" />
            { caption.length ? <p className='w-full text-center my-3 md:mb-12 text-base text-dark-grey'>{ caption }</p> : ""}
        </div>
    )
})

const Quote = React.memo(({ quote, caption}) => {
    return (
        <div className='bg-purple/10 p-3 pl-5 border-l-4 border-purple'>
            <p className='text-xl leading-10 md:text-2xl'>{quote}</p>
            { caption.length ? <p className='w-full text-base text-purple'>{ caption }</p> : ""}
        </div>
    )
})

const List = React.memo(({ style, items }) => {
    return (
      <ol className={`pl-5 ${style == "ordered" ? "list-decimal" : "list-disc"}`}>
        {items.map((listitem, i) => {
          return (
            <li
              key={i}
              className="my-4"
              dangerouslySetInnerHTML={{ __html: listitem }}
            ></li>
          );
        })}
      </ol>
    );
  });

const BlogContent = React.memo(({block}) => {

    let { type , data } = block;
    if(type == "paragraph") {
        return <p dangerouslySetInnerHTML={{ __html:data.text}}></p>
    }
    if(type == "header") {
        if(data.level == 3) {
            return <h3 className='text-3xl font-bold' dangerouslySetInnerHTML={{ __html:data.text}}></h3>
        }
        return <h2 className='text-4xl font-bold' dangerouslySetInnerHTML={{ __html:data.text}}></h2>

    }

    if(type == "image"){
        console.log("into img");
        return <Img url={data.file.url} caption={data.caption} />
    }

    if(type == "quote"){
        return <Quote quote={data.quote} caption={data.caption} />
    }

    if(type == "list") {
        return <List style={data.style} items={data.items} />
    }

    else{
        return <h1>this is a block</h1>
    }
});

export default BlogContent