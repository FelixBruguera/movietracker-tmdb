const RadioItem = ({ name, value, labelText, checked, onChange }) => {
  return (
    <div
      className={`text-sm border-border border-1 px-3 py-1 rounded-sm ${checked ? "bg-primary text-secondary font-bold" : "hover:bg-secondary"}`}
      onClick={() => onChange(value)}
      title="Tu mama por ejemplo"
    >
      <label htmlFor={value}>{labelText}</label>
      <input
        type="radio"
        name={name}
        value={value}
        id={value}
        checked={checked}
        className="appearance-none"
      />
    </div>
  )
}

export default RadioItem
