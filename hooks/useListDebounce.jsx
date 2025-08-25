import { useRouter } from "@tanstack/react-router"
import { useEffect } from "react"

export default function useListDebounce(search) {
  const router = useRouter()
  useEffect(() => {
    let timeout = null
    if (router.query.search !== undefined || search != "") {
      timeout = setTimeout(
        () =>
          router.push({ query: { ...router.query, search: search, page: 1 } }),
        500,
      )
    }
    return () => clearTimeout(timeout)
  }, [search])
}