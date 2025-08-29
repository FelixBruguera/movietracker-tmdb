import { useState } from "react"
import { Button } from "../../app/components/ui/button"
import { ChevronDown, ChevronsDown, ChevronUp } from "lucide-react"

const MovieDescription = ({ description }) => {
  const [isOpen, setIsOpen] = useState(false)
  const firstDot = description.indexOf(".", 800)
  const shortDescription = description.slice(0, firstDot + 1)
  const toggleIsOpen = () => setIsOpen((state) => !state)
  return isOpen ? (
    <>
      <p>{description}</p>
      <Button onClick={toggleIsOpen}>
        Show less <ChevronUp />
      </Button>
    </>
  ) : (
    <>
      <p>{shortDescription}</p>
      <Button onClick={toggleIsOpen}>
        Show more <ChevronDown />
      </Button>
    </>
  )
}

export default MovieDescription