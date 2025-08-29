import { Link } from "react-router"
import MovieDetail from "./MovieDetail"
import Poster from "./Poster"

const PersonLink = ({ name, image, id}) => {
  return (
    <Link
      to={`/?with_people=${id}`}
      title={name}
      aria-label={name}
      className="group"
    >
      <li className="text-center text-sm flex flex-col gap-1 rounded-sm group w-30">
        <Poster src={image} size="xs" alt={name}/>
        <p className="group-hover:text-accent font-bold transition-colors">{name}</p>
      </li>
    </Link>
  )
}

export default PersonLink