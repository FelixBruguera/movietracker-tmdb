import { Button } from "@ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import DialogWrapper from "../shared/DialogWrapper"
import axios from "axios"
import { Plus } from "lucide-react"
import Search from "../search/Search.jsx"
import SearchItemContent from "../search/SearchItemContent.jsx"
import SearchItemWrap from "../search/SearchItemWrap.jsx"

const ListSearchItem = ({ itemData, mutation, ids }) => {
  const name = itemData.title || itemData.name
  const mediaId =
    itemData.media_type === "tv" ? `tv_${itemData.id}` : `movies_${itemData.id}`
  const isDisabled = ids.has(mediaId)
  return (
    <SearchItemWrap className="h-fit">
      <div className="w-full flex flex-col gap-2" title={name}>
        <SearchItemContent
          name={name}
          imgSettings={{ type: "movie", src: itemData.poster_path }}
          mediaType={itemData.media_type}
        />
        <Button
          disabled={isDisabled}
          aria-hidden={isDisabled}
          className={`w-3/4 mx-auto ${isDisabled && "bg-transparent"}`}
          onClick={() => mutation.mutate({ mediaId: mediaId })}
        >
          {!isDisabled && <Plus />}
        </Button>
      </div>
    </SearchItemWrap>
  )
}

const AddToList = ({ list, ids }) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (newEntry) =>
      axios.post(`/api/lists/${list.id}/media`, newEntry),
    onSuccess: () => {
      ;(queryClient.invalidateQueries({ queryKey: ["list_media", list.id] }),
        toast("Succesfully Added"))
    },
    onError: (error) => {
      const message = error.response.data || error.response.statusText
      return toast(message)
    },
  })

  return (
    <DialogWrapper
      title={`Adding to ${list.name}`}
      label="Add movies or TV Shows"
      Icon={Plus}
      contentClass="overflow-auto min-w-2/4"
    >
      <Search
        renderFn={(items) => {
          const cleanItems = items.filter(
            (item) => item.media_type !== "person",
          )
          return cleanItems.length > 0 ? (
            cleanItems.map((itemData) => (
              <ListSearchItem
                key={[itemData.media_type, itemData.id]}
                itemData={itemData}
                mutation={mutation}
                ids={ids}
              />
            ))
          ) : (
            <li>No results</li>
          )
        }}
      />
    </DialogWrapper>
  )
}

export default AddToList
