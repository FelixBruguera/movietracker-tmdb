import { Route, Routes } from 'react-router'
import Header from './components/Header'
import "./styles/app.css"
import Login from './components/Login'
import Movies from './components/Movies'
import Signup from './components/Signup'

const Test = () => {
    return (
        <h1 className='bg-red-700'>Movie Tracker</h1>
    )
}

const App = () => {
//   const [user, userService] = useAuth()

//   if (user.id === null) {
//     return (
//       <div className="px-10 h-screen">
//         <Nav />
//         <Routes>
//           <Route
//             index
//             path="/"
//             element={<Login handleLogin={userService.login} />}
//           />
//           <Route path="/signup" element={<Signup />} />
//         </Routes>
//         <Notification />
//       </div>
//     )
//   }

  return (
    <div>
        <Header />
        <Routes>
            <Route element={<Movies />} index={true} />
            <Route path='/users/login' element={<Login />} />
            <Route path='/users/signup' element={<Signup />} />
        </Routes>
    </div>
)
}

export default App