const TooltipItem = ({ title, value }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-gray-200 text-xs">{title}</p>
      <p className="text-stone-100 font-bold text-sm">{value}</p>
    </div>
  )
}

export default TooltipItem
