import axios from "axios"
import { useState, useEffect } from "react"

export default function useDebounce(search) {
  const [debounceValue, setDebounceValue] = useState([])
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    let timeout = null
    if (search.length > 2) {
      setIsLoading(true)
      setDebounceValue([])
      timeout = setTimeout(
        () =>
          axios
            .get(`/api/movies?search=${search}`)
            .then((response) => response.data)
            .then((data) => {
              setDebounceValue(data[0].movies)
              setIsLoading(false)
            })
            .catch(() => {
              setIsLoading(false)
              setError(true)
            }),
        1000,
      )
    } else {
      setDebounceValue([])
      setIsLoading(false)
    }
    return () => clearTimeout(timeout)
  }, [search])

  return { data: debounceValue, isLoading: isLoading, isError: error }
}
