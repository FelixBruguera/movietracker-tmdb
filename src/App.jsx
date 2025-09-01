import { Route, Routes, ScrollRestoration, useLocation } from "react-router"
import Header from "./components/Header"
import "./styles/app.css"
import Login from "./components/Login"
import Movies from "./components/Movies"
import Signup from "./components/Signup"
import Movie from "./components/Movie"
import MoviesWithKeyword from "./components/MoviesWithKeyword"
import MoviesWithPerson from "./components/MoviesWithPerson"
import { useEffect } from "react"

const App = () => {
  const pathname = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <div className="max-w-500 mx-auto">
      <Header />
      <Routes>
        <Route element={<Movies />} index={true} />
        <Route path="movies/:id" element={<Movie />} />
        <Route path="movies/keyword/:keyword" element={<MoviesWithKeyword />} />
        <Route path="movies/people/:person" element={<MoviesWithPerson />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App
