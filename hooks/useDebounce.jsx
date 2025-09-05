import { useState, useEffect } from "react"

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    let timeout = null
    if (value.length > 2) {
      timeout = setTimeout(() => {
        setDebouncedValue(value)
        setIsLoading(false)
      }, delay)
      setIsLoading(true)
    } else {
      setDebouncedValue("")
      setIsLoading(false)
    }
    return () => clearTimeout(timeout)
  }, [value])

  return { debouncedValue: debouncedValue, isLoading: isLoading }
}
