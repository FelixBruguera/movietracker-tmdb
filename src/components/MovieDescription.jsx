import { useState } from "react"
import { Button } from "../../app/components/ui/button"
import { ChevronDown, ChevronsDown, ChevronUp } from "lucide-react"

const Description = ({ text }) => (
  <p className="text-muted-foreground text-sm lg:text-base text-justify">
    {text}
  </p>
)

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
      <Button className="w-fit" onClick={toggleIsOpen}>
        {" "}
        {title} {isOpen ? <ChevronUp /> : <ChevronDown />}{" "}
      </Button>
    </>
  )
}

export default MovieDescription
