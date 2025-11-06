const TooltipWrapper = (props) => {
  const { isVisible, label } = props
  return (
    <div
      className="bg-stone-900 p-2 rounded-sm w-fit"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {isVisible && (
        <>
          <p className="text-stone-100 font-bold text-sm">{label}</p>
          {props.children}
        </>
      )}
    </div>
  )
}

export default TooltipWrapper
