import { memo } from "react"

const Total = memo(({ total, label }) => {
  if (!total || total < 1) {
    return null
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <p
        className={`px-3 py-1 bg-card text-black dark:text-white font-bold rounded-lg`}
        aria-label={label}
        title={label}
      >
        {total}
      </p>
    </div>
  )
})

export default Total
