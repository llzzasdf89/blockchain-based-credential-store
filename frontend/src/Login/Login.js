import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import Neon from '@cityofzion/neon-js'
import {requestBlockchainServer} from '../util'
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,TextField,Alert,Collapse,AlertTitle} from '@mui/material'
const register = async (setdialogueOpen,setAlertObj,registerForm, setregisterForm)=>{
    setdialogueOpen({loginDialog:false,registerDialog:false})
    const privateKey = Neon.create.privateKey() //generate private key
    //account is a very useful class because it accepts private key as input, output data related to the private key
    const account = Neon.create.account(privateKey) //according to the private key, generate the account Class
    const encrypted = await account.encrypt(registerForm.encryptInfo)
    const {setAlert,setAlertOpen} = setAlertObj
    console.log('register account', account,'account WIF is', account.WIF)
    let res = await requestBlockchainServer('openwallet',["Richard.json","llzzasdf89"]) //try to open the wallet and import this private key
    if(!res){
      setAlert('error')
      setAlertOpen(true)
      return 
    }
    //open wallet successful, now try to import the private key
    res =await requestBlockchainServer('importprivkey',[account.WIF])
      if(!res.address){ //if no address returned, which means the import is failed
        setAlert('error')
        setAlertOpen(true)
        return 
        //import this account into the wallet success
      }
    setregisterForm({
        encryptInfo:registerForm.encryptInfo,
        privateKey:encrypted.export().key
      })
    setAlert('success')
    setAlertOpen(true)
    res = await requestBlockchainServer('closewallet') //after that we need to close wallet
    if(res) console.log('close wallet success')
    console.log('close wallet failed, please check whether the status of wallet file')
}

const login = async (setdialogueOpen,loginForm,navigate)=>{
    setdialogueOpen({loginDialog:false,registerDialog:false})
    let account;
    //login process is quite similar to register, which is done through creating account instance;
    //then we just judge whether this instance could be instantiated, if so, which means login success
    try{
      account = Neon.create.account(loginForm.privateKey)
      console.log(account)
      await account.decrypt(loginForm.encryptInfo) //decrypt the privatekey first
      const {address} = account //if we could derive address from the account, then we login success
      navigate('/Home',{
        state:account
      }) 
    }
    catch(err){
      console.log('your private key or your password is not valid, please check')
    }
}

const Login = () => {
    const [dialogueOpen,setdialogueOpen] = useState({
      loginDialog:false,
      registerDialog:false
    })
    const [loginForm, setloginForm] = useState({
      privateKey:'',
      encryptInfo:''
    }) //loginForm is a object used to stored the information input in the login dialogue
    const [registerForm,setRegisterForm] = useState({
      privateKey:'',
      encryptInfo:''
    }) //regiterFrom is a object used to store the information input in the register dialogue
    const [alertOpen, setAlertOpen] = useState(false) //switch the display of alert message
    const [alert,setAlert] = useState('success')//switch the display of alert message
    const navigate = useNavigate()//claim a navigate hook function from react router, for page direction
    return <div>
        Login Page
        <div>
        <Button variant="contained" component="label" onClick = {()=> {
          setdialogueOpen({loginDialog:true,registerDialog:false})
          setloginForm({privateKey:'',encryptInfo:''})
        }}>
            Login with your private key
        </Button>
        <Dialog open={dialogueOpen.loginDialog} onClose={()=> setdialogueOpen({loginDialog:false,registerDialog:false})}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your private key"
            required
            fullWidth
            onInput = {(e)=> setloginForm({encryptInfo:loginForm.encryptInfo,privateKey:e.target.value})}
            value = {loginForm.privateKey}
            autoComplete = "off"
          />
           <TextField
            margin="dense"
            label="Your encrypt information"
            required
            fullWidth
            value = {loginForm.encryptInfo}
            autoComplete = "off"
            onInput = {(e)=> setloginForm({encryptInfo:e.target.value,privateKey:loginForm.privateKey})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setdialogueOpen({loginDialog:false,registerDialog:false})}>Cancel</Button>
          <Button onClick={()=> login(setdialogueOpen,loginForm,navigate) }>Submit</Button>
        </DialogActions>
        </Dialog>

        </div>
        <div>
        <Button variant="contained" component="label" onClick ={()=>{
            setRegisterForm({privateKey:'',encryptInfo:''}) //each time when opening the dialogue, clear the input from last time
            setdialogueOpen({loginDialog:false,registerDialog:true})
            }}>
            Register a new private key
        </Button>
        <Dialog open={dialogueOpen.registerDialog} onClose={()=> setdialogueOpen({loginDialog:false,registerDialog:false})}>
        <DialogTitle>Encrypt information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To make sure storing private key safely in your device, please input some encrypt information and remember it.
            <br></br>For example, your name like 'John'
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Encrypt information"
            fullWidth
            autoComplete='off'
            value={registerForm.encryptInfo}
            onInput = {(e)=> setRegisterForm({encryptInfo:e.target.value,privateKey:registerForm.privateKey})}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setdialogueOpen({loginDialog:false,registerDialog:false})}>Cancel</Button>
          <Button onClick={()=> register(setdialogueOpen,{
            setAlert,
            setAlertOpen
          },registerForm,setRegisterForm)}>Submit</Button>
        </DialogActions>

        </Dialog>
        <Collapse in = {alertOpen}>
            {alert==='success'?
            <Alert severity="success" onClose={()=> setAlertOpen(false)}>
              <AlertTitle>register private key success</AlertTitle>
              Your private key is '{registerForm.privateKey}', and your password is '{registerForm.encryptInfo}', please remember
            </Alert>:
            <Alert severity="error" onClose={()=> setAlertOpen(false)}>
                register private key error
            </Alert>}
        </Collapse>
        </div>
    </div>
}
export default Login