import { Link, useLocation, useNavigate, useSearchParams } from "react-router"
import { Button } from "@ui/button"
import { ChevronDown, Edit, Plus, Trash } from "lucide-react"
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@ui/dialog"
import AuthInput from "../auth/AuthInput"
import { toast } from "sonner"
import TriggerWrap from "../shared/TriggerWrap"
import { useState } from "react"
import Remove from "../shared/Remove"

const DeleteSearch = ({ id, name }) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ["deleteSearch"],
    mutationFn: () => axios.delete(`/api/users/searches/${id}`),
    onSuccess: () => {
      queryClient.setQueryData(["searches"], (oldData) =>
        oldData.filter((search) => search.id !== id),
      )
      toast("Search deleted")
    },
    onError: (error) => {
      const message = error.response.data || "Something went wrong"
      toast(message)
    },
  })
  return (
    <Remove
      title={`Deleting ${name}`}
      mutation={() => mutation.mutate()}
      className="hover:bg-accent hover:text-white p-2 rounded-lg hover:cursor-pointer"
    >
      <Trash />
    </Remove>
  )
}

const UpdateSearch = ({ id, name }) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const mutation = useMutation({
    mutationKey: ["updateSearch"],
    mutationFn: (data) =>
      axios.patch(`/api/users/searches/${id}`, { name: data.name }),
    onSuccess: (response) => {
      queryClient.setQueryData(["searches"], (oldData) =>
        oldData.map((search) =>
          search.id === response.data.id ? response.data : search,
        ),
      )
      setSearchParams((params) => {
        params.get("search") === name &&
          params.set("search", response.data.name)
        return params
      })
      toast("Search updated")
      setOpen(false)
    },
    onError: (error) => {
      const message = error.response.data || "Something went wrong"
      toast(message)
    },
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="hover:bg-accent hover:text-white p-2 rounded-lg hover:cursor-pointer"
        title="Edit"
        aria-label="Edit"
      >
        <Edit />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update your search</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate({ name: e.target.name.value })
          }}
          className="flex flex-col gap-5"
        >
          <AuthInput
            type="text"
            name="name"
            id="name"
            labelText="Name"
            minLength="3"
            maxLength="100"
            defaultValue={name}
          />
          <Button className="w-1/4 mx-auto">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const NewSearch = () => {
  const queryClient = useQueryClient()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const mutation = useMutation({
    mutationKey: ["newSearch"],
    mutationFn: (data) =>
      axios.post(
        "/api/users/searches",
        { name: data.name, path: data.path },
        { params: data.search },
      ),
    onSuccess: (response) => {
      queryClient.setQueryData(["searches"], (oldData) =>
        oldData.concat(response.data),
      )
      toast("Search saved")
      setSearchParams((params) => {
        params.set("search", response.data[0].name)
        return params
      })
      setOpen(false)
    },
    onError: (error) => {
      const message = error.response.data || "Something went wrong"
      toast(message)
    },
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger title="Save search" aria-label="Save Search">
        <Plus />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Save your current search</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log(searchParams)
            mutation.mutate({
              name: e.target.name.value,
              path: location.pathname,
              search: searchParams,
            })
          }}
          className="flex flex-col gap-5"
        >
          <AuthInput
            type="text"
            name="name"
            id="name"
            labelText="Name"
            minLength="3"
            maxLength="100"
            className="w-1/2"
          />
          <Button className="w-1/4 mx-auto">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const SavedSearch = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["searches"],
    queryFn: () =>
      axios.get("/api/users/searches").then((response) => response.data),
  })
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedSearch = searchParams.get("search") || "None"
  return (
    <div className="flex items-center gap-2 max-w-4/10">
      <Dialog>
        <DialogTrigger
          className="w-fit max-w-9/10 border-border border-1 rounded-md bg-muted dark:bg-input/50 h-9 p-2 hover:bg-transparent transition-colors"
          title="Saved searches"
          aria-label="Saved searches"
        >
          <div className="flex items-center justify-evenly gap-2">
            <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {selectedSearch}
            </p>
            <ChevronDown />
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-8/10 overflow-y-auto scrollbar-thin scrollbar-track-transparent dark:scrollbar-thumb-muted">
          <DialogTitle>Saved searches</DialogTitle>
          <ul className="flex flex-col gap-2">
            {data?.map((search) => {
              const params = new URLSearchParams(search.search).toString()
              return (
                <li
                  key={search.id}
                  className="flex items-center justify-between border-1 border-transparent p-2 rounded-lg bg-transparent hover:border-muted-foreground/20 dark:hover:border-muted transition-colors group"
                >
                  <Link
                    to={{ pathname: search.path, search: params }}
                    className="hover:text-accent transition-colors"
                  >
                    {search.name}
                  </Link>
                  <div className="flex items-center justify-evenly w-1/5">
                    <UpdateSearch id={search.id} name={search.name} />
                    <DeleteSearch id={search.id} name={search.name} />
                  </div>
                </li>
              )
            })}
          </ul>
        </DialogContent>
      </Dialog>
      <NewSearch />
    </div>
  )
}

export default SavedSearch
