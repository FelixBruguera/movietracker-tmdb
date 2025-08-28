import { useEffect } from "react"
import { useSearchParams } from "react-router"

export default function useListDebounce(search) {
  const [searchParams, setSearchParams] = useSearchParams()
  useEffect(() => {
    let timeout = null
    if (searchParams.search !== undefined || search != "") {
      timeout = setTimeout(
        () =>
          setSearchParams(params => {
            params.set("search", search)
            params.set("page", 1)
            return params
        }, 500
      ))
    }
    return () => clearTimeout(timeout)
  }, [search])
}