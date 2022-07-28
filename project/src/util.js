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
export {requestBlockchainServer,convertNumberTobigNumber}