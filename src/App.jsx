import { Route, Routes, ScrollRestoration, useLocation } from "react-router"
import Header from "./components/Header"
import "./styles/app.css"
import Login from "./components/Login"
import Movies from "./components/Movies"
import Signup from "./components/Signup"
import Movie from "./components/Movie"
import MoviesWithParam from "./components/MoviesWithParam"
import MoviesWithPerson from "./components/MoviesWithPerson"
import { useEffect } from "react"
import MovieCredits from "./components/MovieCredits"
import TVShow from "./components/TVShow"

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
        <Route path="movies/:id/credits" element={<MovieCredits />} />
        <Route
          path="movies/company/:id"
          element={<MoviesWithParam endpoint="company" />}
        />
        <Route path="tv" element={<Movies path="tv" />} />
        <Route path="tv/:id" element={<TVShow />} />
        <Route path="tv/:id/credits" element={<MovieCredits path="tv" />} />
        <Route
          path="tv/company/:id"
          element={<MoviesWithParam endpoint="company" path="tv" />}
        />
        <Route
          path="tv/network/:id"
          element={<MoviesWithParam endpoint="network" path="tv" />}
        />
        <Route path="people/:person" element={<MoviesWithPerson />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App
