import { useState,useEffect} from 'react'
import {Link, Outlet,useLocation} from 'react-router-dom'
import {checkBalance} from '../blockchain'
function Home(props){
    const location = useLocation();
    //get the parameters from the navigation component, which is stored in hook function useLocation
    const {state} = location
    let [balance,setBalance] = useState(0)
    const [account] = useState(state) //use hook function to store the account, this is for convininence of sharing it with sub pages.
    useEffect(()=>{
        checkBalance(account._address).then(
            (resolve)=>setBalance(resolve),
            (reject)=>console.error('The blockchain network is disconnected, please check the status of blockchain network')
        )
    })
    return <div style={{"height":300+'px'}}>
        <h1>This is the Index page</h1>
        <div>Your account balance:<br/>{balance}</div>
        <nav>
        <Link to='Fileupload' > Fileupload</Link>
        <Link to='Getfiles'>Get files</Link>
        </nav>
        <Outlet context={[account]}></Outlet>
    </div>

}
export default Home