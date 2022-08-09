import {Container,Box,Button} from '@mui/material'
import { claimgas } from '../../blockchain'
import { useOutletContext } from 'react-router-dom'
const Claimgas = ()=>{
    const [account,balance] = useOutletContext()
    return <Container>
        <Box>
            <h2>Introduction:</h2><br/>
        Since each funcitonality in blockchain consume crytocurrencies (gas), therefore without gas, you are not able to experience any functionality.<br/>
        Considering this problem 'Claim Gas' functionality is designed to reteive some gas for you;<br/>
        Actually, in Main Chain gas can not be claimed. They can only be mined from nodes or transfered from other user's account. But in this Test Chain, all the gas can be controlled and maintained by developer. Therefore the implementaion of 'Claim Gas' is to transfer some gas from developer account to your account;
        <br/>To avoid abusing this functionality, there is a limitation that each address(user account) could only claim gas for once with 1000 gas; 
        <br></br>
        This is more than enough for you to upload apporiximately 10,000 files or querying files for approximately 1,000,000 times.
        <Box>
            <Button variant= 'outlined' size= 'small' sx={{
                marginTop:"30px"
            }
        }
            onClick={()=>{
                claimgas(account)
            }}
            disabled = {balance > 0}
            >
                {balance > 0 ? 'You have already claimed gas':'I understand, Claim Gas'}
            </Button>
        </Box>


        </Box>
    </Container>
}
export default Claimgas