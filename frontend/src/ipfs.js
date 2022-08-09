//encapsulate all the interaction functions with IPFS file system;
import { create } from 'ipfs-http-client'
//Notice we use local IPFS server as demo, if the environment is product environment, this variable should be replaced.
//Besides, please set up IPFS server through IPFS client first, or any services will be rejected.
const IPFSServerAddress = '/ip4/127.0.0.1/tcp/5001' 
const connectToIPFS = async ()=>{
    //this function serves to connect with IPFS node 
 try{
        const addr = IPFSServerAddress
        const http = create(addr)
        const isOnline = http.isOnline()
        if(isOnline) return http;
        return null;
    }
    catch (err){
        console.log(err)
        return null
    }
}
const saveFileToIPFS = async (fileObj,connectedClient)=>{
    //if connection is successful, upload the file to the node
    const sendRequest = async () =>{ 
        try {
            const res = await connectedClient.add(fileObj.content)
            return res.cid.toString()
        }
        catch (err){
            console.error('save file to Ipfs node error, error is ', err)
            return null
        }
    }
    const res = await sendRequest()
    if(!res) return console.log('save file to IPFS node error, please check ')
    return res;
}
export {connectToIPFS, saveFileToIPFS}