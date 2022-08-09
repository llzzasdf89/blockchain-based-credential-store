import { useState,useEffect} from 'react'
import {Outlet,useLocation,Link as RouterLink} from 'react-router-dom'
import {checkBalance} from '../blockchain'
import {Container,Typography,Box,ButtonGroup,Button} from '@mui/material'
function Home(){
    const location = useLocation();
    //get the parameters from the navigation component, which is stored in hook function useLocation
    const {state} = location
    let [balance,setBalance] = useState(0)
    const [account] = useState(state) //use hook function to store the account, this is for convininence of sharing it with sub pages.
    useEffect(()=>{
        checkBalance(account._address).then(
            (resolve)=>setBalance(resolve),
            (reject)=> console.error('Get balance error, error info is', reject)
        )
    })
    return <Container sx={{
        height:'100%',
    }}>
        <Box sx={
            {
                width:"100%",
                height:'400px',
                padding:"30px"
            }
        }>
        <Box>
                        
        <Typography component="h5" variant="h5"
        sx={{
            display:'flex',
            justifyContent:"space-between",
            paddingRight:"50px"
        }}
        >Current connected blockchain is: Test Chain
        <Button variant='outlined' size="medium" component={RouterLink} to='/'>Logout</Button>
        </Typography>
        <br/>
        <Typography component="h5" variant="h5" >
            Welcome,&nbsp; user address: <br/>
            <Typography component="span" variant="h4" sx={{
                textDecoration:'underline'
            }}>{account._address}</Typography>
          </Typography>
        </Box>
        <Box sx={{
            margin:"30px 0"
        }}>
            Your account balance is :
            <Typography component="span" variant="body1" sx={{
            textDecoration:'underline',
            fontStyle:'italic'
            }}>{balance}</Typography> Gas
        </Box>

        <Box>
        <Box>Now you may want to:</Box>
        <br/>
        <Box>
        <ButtonGroup variant="outlined" size='large'
        >
            <Button component={RouterLink} to='Claimgas'>Claim Gas</Button> {/*Component property could define what elements to integrate with. Details on Material UI documentation:https://mui.com/zh/material-ui/guides/composition/#component-prop. We use this to integeate with react-router navigation */}
              <Button component={RouterLink} to='Fileupload'>upload files</Button>
              <Button component={RouterLink} to='Getfiles'>retrive files</Button>
        </ButtonGroup>
        </Box>
        </Box>
        </Box>
        <Outlet context={[account,balance]}></Outlet>
    </Container>

}
export default Home