const Heatmap = ({ values, data, tooltipTitle }) => {
  const dataMax = Object.values(data).sort((a, b) => b - a)[0]
  console.log(dataMax)
  return (
    <ul className="flex items-center justify-center mx-auto gap-0">
      {values.map((value, i) => {
        const total = data[i]
        const colorPercentage = total / dataMax
        return (
          <li className="relative flex flex-col items-center gap-1 group transition-colors hover:cursor-pointer">
            <span
              className={`size-10 border-1 border-border rounded-sm flex items-center justify-center`}
              style={{
                backgroundColor: `rgba(var(--heatmap), ${colorPercentage})`,
              }}
            />
            <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
              {value}
            </p>
            <div className="hidden px-4 py-2 absolute bottom-18 bg-card-bg rounded-lg group-hover:flex items-center justify-evenly w-max">
              <p className="text-xs lg:text-sm">
                {total || 0}{" "}
                {total === 1 ? tooltipTitle.slice(0, -1) : tooltipTitle}{" "}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default Heatmap
