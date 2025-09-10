import { useState } from "react"
import { Dialog } from "../../app/components/ui/dialog"
import TriggerWrap from "./TriggerWrap"
import { Button } from "../../app/components/ui/button"
import Poster from "./Poster"
import { Switch } from "../../app/components/ui/switch"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import ErrorMessage from "./ErrorMessage"
import KeywordSearchSkeleton from "./KeywordSearchSkeleton"
import useRegion from "../stores/region"
import ServiceList from "./ServiceList"

const ServicesCommand = ({ title, selected, setSelected }) => {
  console.log(selected)
  const [searchValue, setSearchValue] = useState("")
  const region = useRegion((state) => state.details.code)
  const [open, setOpen] = useState(false)
  const {
    data: items,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`providers-${region}`],
    queryFn: () =>
      axios.get(`/api/services/${region}`).then((response) => response.data),
    staleTime: 7200 * 60000,
    gcTime: 7200 * 60000, // 5 days
  })
  const selectAll = () =>
    setSelected(new Set(items.results.map((item) => item.provider_id)))
  const list =
    searchValue.length > 1
      ? items?.results.filter((service) =>
          service.provider_name
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        )
      : items?.results
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={title}
        aria-label={title}
      >
        <TriggerWrap>{selected.size} Selected</TriggerWrap>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <ServiceList
          list={list}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          selected={selected}
          setSelected={setSelected}
          selectAll={selectAll}
        />
      </Dialog>
    </>
  )
}

export default ServicesCommand
