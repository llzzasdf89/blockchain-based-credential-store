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
import Getfiles from './Home/Getfiles/Getfiles'
import Claimgas from './Home/Claimgas/Claimgas'
const Router = 
<BrowserRouter>
    <Routes>
    <Route index path = '/' element = {<Login></Login>}></Route>
    <Route path = 'Home' element = {<Home></Home>}>
            <Route path = 'Fileupload' element = {<Fileupload></Fileupload>}></Route>
            <Route path = 'Getfiles' element = {<Getfiles></Getfiles>}></Route>
            <Route path = 'Claimgas' element = {<Claimgas></Claimgas>}></Route>
    </Route>
    </Routes>
</BrowserRouter>

export default Router
