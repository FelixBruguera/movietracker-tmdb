import { Button } from "../../app/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import { toast } from "sonner"
import DialogWrapper, { DialogContext } from "./DialogWrapper"
import axios from "axios"
import { Plus } from "lucide-react"
import Search from "./Search.jsx"
import SearchItemContent from "./SearchItemContent.jsx"
import SearchItemWrap from "./SearchItemWrap.jsx"
import { useSearchParams } from "react-router"

const ListSearchItem = ({ itemData, mutation }) => {
  const name = itemData.title || itemData.name
  const mediaData = {
    id: itemData.id,
    title: itemData.title || itemData.name,
    poster: itemData.poster_path,
    releaseDate: itemData.release_date || itemData.first_air_date,
    isTv: itemData.media_type === "tv",
  }
  return (
    <SearchItemWrap className="h-fit">
      <div className="w-full flex flex-col gap-2">
        <SearchItemContent
          name={name}
          imgSettings={{ type: "movie", src: itemData.poster_path }}
          mediaType={itemData.media_type}
        />
        <Button
          disabled={itemData.media_type === "person"}
          className="w-3/4 mx-auto"
          onClick={() => mutation.mutate(mediaData)}
        >
          <Plus />
        </Button>
      </div>
    </SearchItemWrap>
  )
}

const AddToList = ({ list }) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (newEntry) =>
      axios.post(`/api/lists/${list.id}/media`, newEntry),
    onSuccess: () => {
      console.log(["list_media", list.id])
      queryClient.invalidateQueries({ queryKey: ["list_media", list.id] })
      toast("Succesfully Added")
    },
    onError: (error) =>
      toast(error.response.data.error || error.response.statusText),
  })

  return (
    <DialogWrapper
      title={`Adding to ${list.name}`}
      label="Add movies or TV Shows"
      Icon={Plus}
      contentClass="overflow-y-scroll min-w-2/4"
    >
      <Search
        renderFn={(items) =>
          items.map((itemData) => (
            <ListSearchItem
              key={[itemData.media_type, itemData.id]}
              itemData={itemData}
              mutation={mutation}
            />
          ))
        }
      />
    </DialogWrapper>
  )
}

export default AddToList
