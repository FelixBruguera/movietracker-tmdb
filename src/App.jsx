import { Route, Routes } from 'react-router'
import Header from './components/Header'
import "./styles/app.css"
import Login from './components/Login'
import Movies from './components/Movies'
import Signup from './components/Signup'
import Movie from './components/Movie'

const App = () => {
  return (
    <div>
        <Header />
        <Routes>
            <Route element={<Movies />} index={true} />
            <Route path='movies/:id' element={<Movie />} />
            <Route path='/users/login' element={<Login />} />
            <Route path='/users/signup' element={<Signup />} />
        </Routes>
    </div>
)
}

export default App