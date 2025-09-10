import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "../../app/components/ui/dialog"
import TriggerWrap from "./TriggerWrap"
import { Input } from "../../app/components/ui/input"
import MovieDetail from "./MovieDetail"
import { Button } from "../../app/components/ui/button"
import { Plus, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import useDebounce from "../../hooks/useDebounce"
import { useState } from "react"
import axios from "axios"
import ErrorMessage from "./ErrorMessage"
import KeywordSearchSkeleton from "./KeywordSearchSkeleton"

const KeywordSearch = ({ title, selected, setSelected }) => {
  const [searchValue, setSearchValue] = useState("")
  const { debouncedValue, isLoading } = useDebounce(searchValue, 1000)
  const {
    data,
    isLoading: queryLoading,
    isError,
  } = useQuery({
    queryKey: ["keyword-search", debouncedValue],
    queryFn: () => axios.get(`/api/keyword/search/${debouncedValue}`),
    enabled: debouncedValue.length > 2,
    staleTime: 7200 * 60000,
    gcTime: 7200 * 60000, // 5 days
  })
  const addItem = (keyword) => setSelected((prev) => prev.concat(keyword))
  const removeItem = (keyword) =>
    setSelected((prev) => prev.filter((item) => item.id !== keyword.id))
  const selectedLength = selected.length
  const canAddMore = selectedLength < 10
  const Keyword = ({ keyword }) => (
    <MovieDetail>
      <p>{keyword.name}</p>
      {selected.some((item) => item.id === keyword.id) ? (
        <Button
          variant="outline"
          className="size-fit text-accent has-[>svg]:px-0"
          title="Remove"
          aria-label="Remove"
          onClick={() => removeItem(keyword)}
        >
          {" "}
          <X />
        </Button>
      ) : (
        <Button
          variant="outline"
          className="size-fit has-[>svg]:px-0 hover:text-accent transition-colors"
          title="Add"
          aria-label="Add"
          disabled={!canAddMore}
          onClick={() => addItem(keyword)}
        >
          {" "}
          <Plus />
        </Button>
      )}
    </MovieDetail>
  )
  return (
    <Dialog>
      <DialogTrigger title={title} aria-label={title}>
        <TriggerWrap>{selectedLength} Selected</TriggerWrap>
      </DialogTrigger>
      <DialogContent className="max-h-8/10 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground">
        <DialogTitle>Keywords</DialogTitle>
        <DialogDescription>{selectedLength}/10</DialogDescription>
        <div className="h-fit flex overflow-x-auto scrollbar-thin pb-2 scrollbar-track-transparent scrollbar-thumb-muted-foreground gap-3">
          {selected.map((selectedKeyword) => (
            <Keyword key={selectedKeyword.id} keyword={selectedKeyword} />
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            name="keyword-search"
            id="keyword-search"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button
            className="w-fit"
            onClick={() => setSelected([])}
            variant={selectedLength < 1 ? "ghost" : "default"}
            disabled={selectedLength < 1}
          >
            Clear
          </Button>
        </div>
        {isError ? (
          <ErrorMessage />
        ) : isLoading || queryLoading ? (
          <KeywordSearchSkeleton />
        ) : (
          <div className="flex flex-wrap items-center gap-3 justify-start">
            {data?.data.results.map((keyword) => (
              <Keyword key={keyword.id} keyword={keyword} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default KeywordSearch
