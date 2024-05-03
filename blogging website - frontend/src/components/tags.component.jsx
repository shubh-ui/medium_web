
const Tags = ({tag = ""}) => {

    return (
      <div className="relative p-2 mt-2 ml-2 px-4 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8">
        <p className="outline-none">
          {tag}
        </p>

        <button className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2">
          <i className="fi fi-br-cross text-sm"
            onClick={handleTagDelet}
          ></i>
        </button>
      </div>
    );
}

export default Tags;