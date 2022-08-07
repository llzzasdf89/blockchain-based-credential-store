
import {Button} from '@mui/material'
import { create } from 'ipfs-http-client'
import {useState} from 'react'
import { useOutletContext } from 'react-router-dom'
import {createInvokeContractTransaction,performTransaction} from '../../blockchain'
const connectToIpfs = async ()=>{
    //this function serves to connect with IPFS node 
 try{
        const addr = '/ip4/127.0.0.1/tcp/5001'
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
const saveFile = async (e,setPreviewImageUrl,setFileHash)=>{
    const file = e.target.files[0] //from the upload event, read the file object
    if(!file ) return; //no file object detected; 
    const readFile = ()=>{
        return new Promise((resolve,reject)=> {
            const fileReader = new FileReader()
            //if file type is text, read it as String , or read it as buffer
            fileReader.readAsArrayBuffer(file)
            fileReader.onload = event => {
                const {result} = event.currentTarget
                resolve(result)
            }  
            fileReader.onerror = error => reject(null)
        })
    }
    const fileContent = await readFile ()
    if(!fileContent) return console.log('read file error')
    const connectObj = await connectToIpfs(); //before store files to IPFS, we need to connect with the node first
    if(!connectObj) return console.log('connect to IPFS server error, please check IPFS node status')
    const saveFileToIpfs = async (file) =>{ //if connection is successfully, upload the file to the node
        try {
            const res = await connectObj.add(fileContent,{
                progress:(prog)=>console.log('received:', prog)
            })
            return res.cid.toString()
        }
        catch (err){
            console.log('save file to Ipfs node error, error is ', err)
            return null
        }
    }
    const res = await saveFileToIpfs(file)
    if(!res) return console.log('save file to IPFS node error, please check ')
    setFileHash(res)
    console.log('save file to IPFS node successful, the saved file cid(hash value) is ', res)
    const previewImageUrl = URL.createObjectURL(file) //create Url for previewImage through URL object
    setPreviewImageUrl(previewImageUrl)
}
const sendFileHashToBlockchain = (account,fileHash)=>{
    //Receive an account object to create a transaction to invoke Smart Contract function to store the file hash from IPFS
    const invokeCall = createInvokeContractTransaction('0x73a6ed77f96d6d7e151322e7d469476fbe07fddd',account,'setfileHash',[{
        type:"String",
        value:account._address
    },
    {
        type:"String",
        value:fileHash
    }
]);
    invokeCall.then((transaction)=> performTransaction(transaction,account).then(resolve =>{
        console.log('perform transaction success, received transaction hash value', resolve.hash)
    },reject=>{
        console.log('perform transaction failed, error information ', reject)
    })
    ,reject=>console.error('reject',reject))
}
const Fileupload = (props) => {
    const [previewImageUrl,setPreviewImageUrl] = useState(null)
    const [fileHash,setFileHash] = useState(null)
    const [account] = useOutletContext();
    return <div>
        <Button variant="contained" component="label">
            Upload
        <input 
        hidden 
        accept="*" 
        type="file" 
        onChange= {(event) => {
            saveFile (event,setPreviewImageUrl,setFileHash)
            sendFileHashToBlockchain(account,fileHash)
        }
        
        }
        />
</Button>
    <img src={previewImageUrl} alt='preview Area'></img>
    </div>

}
export default Fileupload