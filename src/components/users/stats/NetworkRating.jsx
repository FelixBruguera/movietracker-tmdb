import { Link } from "react-router"
import Poster from "../../shared/Poster"
import ItemDetail from "./ItemDetail"

const NetworkRating = ({ data }) => {
  const baseImgUrl = "https://image.tmdb.org/t/p/"
  return (
    <Link
      to={`/tv/network/${data.id}`}
      className="flex flex-col items-center px-4 shadow-md group bg-card-bg py-3 rounded-md"
    >
      <div className="h-18 flex items-center justify-center">
        <img src={`${baseImgUrl}/w92/${data.logo_path}`} className="w-[92px]" />
      </div>
      <h3 className="text-base my-1 group-hover:text-accent transition-colors">
        {data.name}
      </h3>
      {data.averageRating && (
        <ItemDetail
          name="Rating"
          value={parseFloat(data.averageRating).toFixed(2)}
        />
      )}
      <ItemDetail
        name={data.total === 1 ? "Show" : "Shows"}
        value={data.total}
      />
    </Link>
  )
}

export default NetworkRating
