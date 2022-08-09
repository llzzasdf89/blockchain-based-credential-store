import { useState,useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getFileList,convertBinaryStringToString} from '../../blockchain'
import {Container,Table,TableContainer,TableBody,TableCell,TableHead,TableRow, Typography} from '@mui/material'
const Getfiles = ()=>{
    const [fileList,setfileList] = useState([])
    const [account] = useOutletContext();
    //React `useEffect` is a hook function, which is invoked every time after the render job finished.
    //This function is ideal for fetching data to fill up UI. Apart from this, it can be customized through the second argument to optimize performance issue.
    //The first param is a function,which will be invoked according to the second parameter. The second param is an array containing several variables. Once a value of variable in this array changed, the function of first paramter will be invoked.
    useEffect(()=>{
        getFileList(account).then(resolve=>{
            let counter = 0 
            const fileList = resolve.map((item)=>{
                item.id = counter++;
                return item
            })
            setfileList(fileList)
            
        })
    },
    //Here I put JSON.stringify(fileList) instead of variable fileList itself, 
    //this is because fileList is an array, if we do not change it to string value to compare, each invocation of 'getFileList' will return a new array instance. So that the page will re-render infinitely,which will cause a serious performance issue.
     //The essential reason is that React consider the new instance as new value. Once React receives new value, it will re-render the page automatically.
     //So to avoid this, I convert the array to string to judge whether the value is actually changed.
    [JSON.stringify(fileList)])
    return <Container>
        <Typography>
            When you got your fileHash, you can access your file through browser url:<br/>
            https://ipfs.io/ipfs/fileHash;
            <br/>For example:
            https://ipfs.io/ipfs/Qmdegn5Kr5pmFFDETjPRACh9tXGohofAdTcZC4LPuzeJp4
        </Typography>
        {fileList && (fileList&&fileList.length > 0)?
        <TableContainer sx={{
            maxHeight:"500px"
        }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>File Name</TableCell>
                        <TableCell align="center">File Hash</TableCell>
                        <TableCell align="right">Upload Time</TableCell>
                    </TableRow>
        </TableHead>
        <TableBody>
        {
        fileList.map((item)=><TableRow key={item.id}>
        <TableCell>
        {convertBinaryStringToString(item.value[0].value)}
          </TableCell>
          <TableCell align="right">{convertBinaryStringToString(item.value[1].value)}</TableCell>
          <TableCell align="right">{new Date(parseInt(item.value[2].value)).toLocaleString()}</TableCell>
        </TableRow>
        )
        
        }
        </TableBody>
            </Table>
        </TableContainer>
        :<div>No files found</div>
        }
        </Container>
}

export default Getfiles