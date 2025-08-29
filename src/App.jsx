import { Route, Routes } from 'react-router'
import Header from './components/Header'
import "./styles/app.css"
import Login from './components/Login'
import Movies from './components/Movies'
import Signup from './components/Signup'
import Movie from './components/Movie'
import MoviesWithParam from "./components/MoviesWithParam"

const App = () => {
  return (
    <div className='max-w-500 mx-auto'>
        <Header />
        <Routes>
            <Route element={<Movies />} index={true} />
            <Route path='movies/:id' element={<Movie />} />
            <Route path='movies/keyword/:keyword' element={<MoviesWithParam name="keyword" endpoint="keyword" title="Movies" titleBeforeParam={false} />} />
            <Route path='movies/cast/:cast' element={<MoviesWithParam name="cast" endpoint="cast" title="Movies with" titleBeforeParam={true} />} />
            <Route path='/users/login' element={<Login />} />
            <Route path='/users/signup' element={<Signup />} />
        </Routes>
    </div>
)
}

export default App