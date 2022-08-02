import { useState } from 'react'
import {Link} from 'react-router-dom'
import { useLocation } from "react-router-dom";
import {requestBlockchainServer,convertNumberTobigNumber,invokefunctionOfContract} from '../util'
const checkBalance = async (addressOfAccount)=>{
    let res = await requestBlockchainServer('openwallet',['Richard.json','llzzasdf89'])
    if(!res){
        console.error('openwallet failed, please check')
        return
    }
    res = await requestBlockchainServer('getnep17balances',[addressOfAccount])
    if(res.address) return res.balance; //if the response contains address, then it means the query is successfull and therefore we could obtain balance
    throw new Error('obtain balance failed')
}
function Home(props){
    const location = useLocation();
    const {state} = location
    //get the parameters from the navigation component, which is stored in hook function useLocation
    const [balance,setBalance] = useState({Gas:0,Neo:0})
    // checkBalance(state._address).then((resolve)=>{
    //     //big number is a number class in Neonjs libary to record amount of crytocurrency.
    //     //Since each Neo and Gas is firstly designed as integer type <Reference: official documentation of Neo:https://docs.neo.org/docs/zh-cn/reference/rpc/latest-version/api/getnep17balances.html>
    //     //for convinience, Neo designer decided to right shift this number, for 8 digits:
    //     //for example: 1 Gas = 10000000 Gas (since number '1' ->right shift 8 digits -> '10000000')
    //     //therefore, in client we have to left shift this number for 8 digits to get the actual value, for display
    //     //The function is encapsulated in utils.js, which is named as 'convertNumberTobigNumber'
    //     setBalance({
    //         Gas:resolve[0]?convertNumberTobigNumber(resolve[0].amount):0,
    //         Neo:resolve[1]?convertNumberTobigNumber(resolve[1].amount):0
    //     })
    //     //deconstruct methods from Smart Contract, which is bound in variable 'storageContract'
    // },(reject)=>console.error('The blockchain network is disconnected, please check the status of blockchain network'))
    invokefunctionOfContract('0x331305d80eb015a3756d1e48da65aa6daf7ba886','main',
        [],[],false).then(resolve=>console.log(resolve),reject=>console.log(reject))
    return <div style={{"height":300+'px'}}>
        <h1>This is the Index page</h1>
        <div>Your balance:</div>
        <div>Neo:{balance.Neo}</div>
        <div>Gas:{balance.Gas}</div>
        <nav>
        <Link to='/Fileupload' > Fileupload</Link>
        </nav>

    </div>

}
export default Home