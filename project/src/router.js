/**
 * Define the routes of each page
 */
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'
import Home from './Home/Home'
import Fileupload from './Home/Fileupload/Fileupload'
import Login from './Login/Login'
const Router = 
<BrowserRouter>
    <Routes>
    <Route path = '/' element = {<Login></Login>}></Route>
    <Route path = 'Home' element = {<Home></Home>}></Route>
    <Route path = 'Fileupload' element = {<Fileupload></Fileupload>}></Route>
    </Routes>
</BrowserRouter>

export default Router
