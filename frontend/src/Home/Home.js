import React from 'react'
import {Link} from 'react-router-dom'
function Home(props){
    return <div style={{"height":300+'px'}}>
        <h1>This is the Index page</h1>
        <nav>
        <Link to='/Fileupload' > Fileupload</Link>
        </nav>

    </div>

}
export default Home