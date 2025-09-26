const HorizontalList = (props) => {
  return (
    <ul className="flex lg:max-w-180 2xl:max-w-250 overflow-x-auto overflow-y-hidden py-2 justify-start items-center scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-muted-foreground">
      {props.children}
    </ul>
  )
}

export default HorizontalList
