import { useState } from "react"
import { Button } from "@ui/button"
import { ChevronDown, ChevronsDown, ChevronUp } from "lucide-react"
import Description from "../shared/Description"

const MovieDescription = ({ description, length = 800 }) => {
  const [isOpen, setIsOpen] = useState(false)
  const firstDot = description.indexOf(".", length)
  if (description.length < length || description.length - firstDot < 150) {
    return <Description text={description} />
  }
  const shortDescription = description.slice(0, firstDot + 1)
  const toggleIsOpen = () => setIsOpen((state) => !state)
  const title = isOpen ? "Show less" : "Show more"
  return (
    <>
      <Description text={isOpen ? description : shortDescription} />
      <Button variant="outline" className="w-fit" onClick={toggleIsOpen}>
        {" "}
        {title} {isOpen ? <ChevronUp /> : <ChevronDown />}{" "}
      </Button>
    </>
  )
}

export default MovieDescription
