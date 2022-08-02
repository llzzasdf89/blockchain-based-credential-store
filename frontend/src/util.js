//encapsulate some common methods,attributes across the pages;
import Neon from '@cityofzion/neon-js'
const NeoBlockchainRPCServer = "http://localhost:10332";
const client = Neon.create.rpcClient(NeoBlockchainRPCServer)
const requestBlockchainServer = async (method,params)=>{
        const query = Neon.create.query({
            method,
            params
      })
      return await client.execute(query)
}
const convertNumberTobigNumber =(num)=>{
    //this function mainly used to convert a number to 'Big number', and left shift it for 8 digits
    const bigNumber =  Neon.u.BigInteger.fromNumber(num)
    return bigNumber.toDecimal(8) //left sheft this number of 8 digits
}
//receive a contract hash value, return the status of the corresponding contract
const getcontractstate = async (contract_hash)=>{
    let res = await requestBlockchainServer('getcontractstate',[contract_hash])
    if(!res) {
        console.error('getcontract state error, please check whether the contract is deployed. Or passing a wrong contract hash value?')
        return null
    }
    return res
}
//invoke the function inside the deployed contract
const invokefunctionOfContract = async (contract_hash,functionName,params = [],sender=[],useDiagnostic=false)=>{
    let res = await getcontractstate(contract_hash)
    if(!res) return //if contract status is error, end the function
    res = await requestBlockchainServer('invokefunction',[contract_hash,functionName,params,sender,useDiagnostic])
    if(!res || res.state !=='HALT') {
        console.error('invoke function failed, please check the error information')
        throw new Error(res)
    }
    return res;
}
export {requestBlockchainServer,convertNumberTobigNumber,invokefunctionOfContract}