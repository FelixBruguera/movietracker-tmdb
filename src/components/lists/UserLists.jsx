import { Eye, MinusCircle, Plus } from "lucide-react"
import { Button } from "@ui/button"

const UserLists = ({ lists, addToListMutation, removeFromListMutation }) => {
  return (
    <ul>
      {lists.length > 0 ? (
        lists.map((list) => {
          return (
            <li
              key={list.id}
              className="flex justify-between items-center mb-2"
            >
              <div className="flex items-center gap-2">
                <p>{list.name}</p>
                {list.isPrivate && <Lock aria-label="Private" />}
                {list.isWatchlist && <Eye aria-label="Watchlist" />}
              </div>
              {list.includesMedia ? (
                <Button
                  variant="ghost"
                  title="Remove from list"
                  aria-label="Remove from list"
                  className="text-accent"
                  onClick={() => removeFromListMutation.mutate(list.id)}
                >
                  <MinusCircle />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  title="Add to list"
                  aria-label="Add to list"
                  onClick={() => addToListMutation.mutate(list.id)}
                >
                  <Plus />
                </Button>
              )}
            </li>
          )
        })
      ) : (
        <li className="text-muted-foreground">No lists to show</li>
      )}
    </ul>
  )
}

export default UserLists
