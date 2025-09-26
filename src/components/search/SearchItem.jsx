import { Link } from "react-router"
import Poster from "../shared/Poster.jsx"
import SearchItemWrap from "./SearchItemWrap.jsx"
import SearchItemContent from "./SearchItemContent.jsx"

const SearchItem = ({ itemData, setOpen }) => {
  const path =
    itemData.media_type === "person"
      ? "people"
      : itemData.media_type === "movie"
        ? "movies"
        : "tv"
  const name = itemData.title || itemData.name
  const imgSettings =
    path === "people"
      ? { type: "person", src: itemData.profile_path }
      : { type: "movie", src: itemData.poster_path }
  return (
    <SearchItemWrap>
      <Link
        to={`/${path}/${itemData.id}`}
        title={name}
        className="w-full flex flex-col gap-2"
        onClick={() => setOpen(false)}
      >
        <SearchItemContent
          name={name}
          imgSettings={imgSettings}
          mediaType={itemData.media_type}
        />
      </Link>
    </SearchItemWrap>
  )
}

export default SearchItem
