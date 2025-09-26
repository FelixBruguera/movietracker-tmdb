const SearchItemWrap = (props) => {
  return (
    <li
      className={`w-1/3 lg:w-1/5 2xl:w-1/6 p-2 rounded-lg items-center h-1/2 border-transparent border-1
            group hover:border-border hover:cursor-pointer transition-colors  ${props.className}`}
    >
      {props.children}
    </li>
  )
}

export default SearchItemWrap
