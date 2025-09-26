const TriggerButton = (props) => {
  return (
    <div className="border-1 rounded-lg p-2 border-border dark:border-border lg:border-transparent dark:lg:border-transparent hover:border-stone-400 hover:bg-stone-100 hover:dark:border-stone-600 hover:dark:bg-stone-900 hover:cursor-pointer transition-colors">
      {props.children}
    </div>
  )
}

export default TriggerButton
