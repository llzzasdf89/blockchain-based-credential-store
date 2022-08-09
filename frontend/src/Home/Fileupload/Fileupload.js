
import {Button,Container,Box,Dialog,DialogActions,DialogContent,DialogTitle} from '@mui/material'
import {useState} from 'react'
import { useOutletContext } from 'react-router-dom'
import {createInvokeContractTransaction,performTransaction,convertNumberTobigNumber} from '../../blockchain'
import {saveFileToIPFS, connectToIPFS} from '../../ipfs'
const uploadFile = async (e,setPreviewImageUrl,setFile)=>{
    //receive file, process it to byte data to preview for client.
    const file = e.target.files[0] //from the upload event, read the file object
    if(!file ) return; //no file object detected;
    const readFileObjectAsBytes = ()=>{
        //Note: file object can not be stored directly to the IPFS node.Therefore, we need to process it to byte data or string data
        return new Promise((resolve,reject)=> {
            const fileReader = new FileReader()
            //if file type is text, read it as String , or read it as buffer
            fileReader.readAsArrayBuffer(file)
            fileReader.onload = event => {
                const {result} = event.currentTarget
                resolve(result)
            }  
            fileReader.onerror = error => console.error('Process file to bytes error')
        })
    }
    const fileInByteFormat = await readFileObjectAsBytes ()
    if(!fileInByteFormat) return console.error('process file to byte data error');
    const fileObj = {
        name:file.name,
        content:fileInByteFormat
    }
    const previewImageUrl = URL.createObjectURL(file) //create Url for previewImage through URL object
    setPreviewImageUrl(previewImageUrl)
    setFile(fileObj)
}

const sendFileToIPFS = async (fileObj)=>{
    const connectedClient = await connectToIPFS(); //before storing files to IPFS, we need to connect with the node first
    if(!connectedClient) {
        console.log('connect to IPFS server error, please check IPFS node status')
        return
    }
    const res = await saveFileToIPFS(fileObj,connectedClient)
    if(!res) throw new Error('save file to IPFS node error, please check ')
    return res;
}

const createTransaction = async (account,fileObj,fileHash,setfee)=>{
    //before save file to blockchain, we need to create a new transaction to confirm fees.
    const transaction = await createInvokeContractTransaction(account,'setFile',[{
        type:"String",
        value:account._address
    },
    {
        type:"String",
        value:fileObj.name
    },
    {
        type:"String",
        value:fileHash
    },
    {
        type:"Integer",
        value:Date.now()
    }
]);
    if(transaction && transaction.fees){
        setfee(convertNumberTobigNumber(transaction.fees))
        return transaction
    }
    throw Error('create transaction error, error is ', transaction)
}
const sendFileHashToBlockchain = (transaction,account)=>{
    performTransaction(transaction,account).then(
        resolve => alert(`perform transaction success, received transaction hash:${resolve.hash}`),
        reject => alert(`perform transaction failed, error information is ${reject}`)
        )
}
const Fileupload = (props) => {
    const [previewImageUrl,setPreviewImageUrl] = useState(null)
    const [file, setFile] = useState(null)
    const [confirmDialogueOpen,setconfirmDialogueOpen] = useState(false)
    const [confirmFeeDialogueOpen,setconfirmFeeDialogueOpen] = useState(false)
    const [transaction,setTransaction] = useState(null)
    const [fee,setfee] = useState(0)
    const [account] = useOutletContext();
    return <Container sx={{
        display:'flex',
        flexDirection:"column",
        justifyContent:"space-between"
    }}>
        <Box>
        <Button variant="contained" component="label">
            Click to upload file
        <input 
        hidden 
        accept="*" 
        type="file" 
        onChange= {(event) => uploadFile(event,setPreviewImageUrl,setFile)        }
        />
</Button>
        </Box>
    <Box sx={{
        marginTop:'20px'
    }}>
        <Box>Preview Area:</Box>
        <img src={previewImageUrl} style={{
            maxHeight:"300px",
            maxWidth:"1000px",
            marginTop:'10px'
        }} alt={(previewImageUrl && previewImageUrl != '')?"Does not support preview of this kind of file":'Upload a file to preview'}></img>
        <Box sx={{
            display:previewImageUrl?'block':'none'
        }}>
            <Button variant='contained' onClick={()=>setconfirmDialogueOpen(true)}>Confirm</Button>
        </Box>
    </Box>
    <Dialog open={confirmDialogueOpen}>
                <DialogTitle>
                Make sure you have enough funds
                </DialogTitle>
                <DialogContent>
                Before save files to IPFS and Blockchain, please make sure you have enough funds to support this operation;
                Or this operation will be likely failed.
                </DialogContent>
                <DialogActions>
                <Button onClick={()=> {
                    setconfirmDialogueOpen(false)
                    setPreviewImageUrl('')
                    setFile(null)
                }}>Cancel</Button>
                <Button onClick={()=>{
                    setconfirmDialogueOpen(false)
                    sendFileToIPFS(file).then((resolveWithfileHash)=>{
                        //if send File to IPFS success, we will receive a file Hash value, so that we could use this file Hash value to create transaction to blockchain
                        createTransaction(account,file,resolveWithfileHash,setfee).then((resolve)=>setTransaction(resolve),reject=> console.error('create transaction error, error info is ', reject))
                        setTimeout(()=>setconfirmFeeDialogueOpen(true),3000)
                    },reject=>{
                        console.error('Upload file to IPFS node error ,error info is ',reject)
                    })
                }
                    
                    }>
                    Confirm
                </Button>
        </DialogActions>
    </Dialog>
    <Dialog open={confirmFeeDialogueOpen}>
                <DialogContent>
                This transaction will cost {fee} Neo. 
                Click 'Confirm' to submit transaction
                </DialogContent>
                <DialogActions>
                <Button onClick={()=> {
                    setconfirmFeeDialogueOpen(false)
                    }}>Cancel</Button>
                <Button onClick={()=>{
                    sendFileHashToBlockchain(transaction,account)
                    setconfirmFeeDialogueOpen(false)    
                    setPreviewImageUrl(null)
                    setFile(null)
                    setfee(0)
                    }}>
                    Confirm
                </Button>
        </DialogActions>
    </Dialog>
    
    </Container>

}
export default Fileupload