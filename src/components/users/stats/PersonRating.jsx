import { Link } from "react-router"
import Poster from "../../shared/Poster"
import ItemDetail from "./ItemDetail"

const PersonRating = ({ data, scope }) => {
  return (
    <Link
      to={`/people/${data.id}`}
      className="flex flex-col items-center px-2 group"
    >
      <Poster src={data.profile_path} size="xs" type="person" />
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
        name={data.total === 1 ? scope.slice(0, -1) : scope}
        value={data.total}
      />
    </Link>
  )
}

export default PersonRating
