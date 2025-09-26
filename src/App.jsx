import { Route, Routes, ScrollRestoration, useLocation } from "react-router"
import Header from "./components/shared/Header"
import "./styles/app.css"
import Login from "./components/auth/Login"
import Movies from "./components/media/Movies"
import Signup from "./components/auth/Signup"
import Media from "./components/media/Media"
import MoviesWithParam from "./components/media/MoviesWithParam"
import MoviesWithPerson from "./components/people/MoviesWithPerson"
import { useEffect } from "react"
import MovieCredits from "./components/media/MovieCredits"
import Lists from "./components/lists/Lists"
import List from "./components/lists/List"
import Footer from "./components/shared/Footer"
import UserList from "./components/users/UserList"
import Diary from "./components/users/Diary"
import ProfileHeader from "./components/users/ProfileHeader"
import ProfileReviews from "./components/users/ProfileReviews"
import ProfileLists from "./components/users/ProfileLists"
import MobileMenu from "./components/shared/MobileMenu"

const App = () => {
  const pathname = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <div className="max-w-450 mx-auto px-0 lg:px-6 flex flex-col justify-between min-h-dvh">
      <Header />
      <Routes>
        <Route element={<Movies />} index={true} />
        <Route path="movies/:id" element={<Media />} />
        <Route path="movies/:id/credits" element={<MovieCredits />} />
        <Route
          path="movies/company/:id"
          element={<MoviesWithParam endpoint="company" />}
        />
        <Route path="tv" element={<Movies path="tv" />} />
        <Route path="tv/:id" element={<Media isTv={true} />} />
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
        <Route path="/lists" element={<Lists />} />
        <Route path="/lists/:id" element={<List />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<ProfileHeader />}>
          <Route index={true} element={<ProfileReviews />} />
          <Route path="diary" element={<Diary />} />
          <Route path="lists" element={<ProfileLists />} />
        </Route>
      </Routes>
      <MobileMenu />
      <Footer />
    </div>
  )
}

export default App
