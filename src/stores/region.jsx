import { create } from "zustand"
import { persist } from "zustand/middleware"

const useRegion = create()(
  persist(
    (set) => ({
      details: {
        name: "United States",
        code: "US",
        flag: "https://flagcdn.com/w320/us.png",
      },
      updateRegion: (newValue) => set({ details: newValue }),
    }),
    { name: "userRegion" },
  ),
)

export default useRegion
