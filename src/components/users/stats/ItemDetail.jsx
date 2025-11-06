const ItemDetail = ({ name, value }) => {
  return (
    <div className="flex items-center gap-1">
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{name}</p>
    </div>
  )
}

export default ItemDetail
