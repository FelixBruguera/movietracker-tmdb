const SearchItemWrap = (props) => {
  return (
    <li
      className={`w-1/4 lg:w-1/5 2xl:w-1/6 p-2 rounded-lg items-center h-2/4 border-transparent border-1
            group hover:border-border hover:cursor-pointer transition-all ${props.className}`}
    >
      {props.children}
    </li>
  )
}

export default SearchItemWrap
