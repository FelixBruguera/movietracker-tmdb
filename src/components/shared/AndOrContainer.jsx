import { Button } from "@ui/button"
import { CircleQuestionMark } from "lucide-react"
import DialogWrapper from "./DialogWrapper"

const AndOrContainer = (props) => {
  return (
    <div className="flex items-center ml-auto w-fit">
      {props.children}
      <DialogWrapper title="Search logic" Icon={CircleQuestionMark}>
        <ul className="text-justify max-w-9/10">
          <li>
            <p>
              <b>AND:</b> Results must match <b>all</b> of your selected items.
              Searching for Action AND Comedy will only find movies classified
              as both (e.g., Deadpool, The Naked Gun).
            </p>
          </li>
          <br />
          <li>
            <p>
              <b>OR:</b> Results can match <b>any</b> of your selected items.
              Searching for Action OR Comedy will find all Action movies plus
              all Comedy movies.
            </p>
          </li>
        </ul>
      </DialogWrapper>
    </div>
  )
}

export default AndOrContainer
