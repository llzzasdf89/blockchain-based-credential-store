import { useState,useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getFileList,convertBinaryStringToString} from '../../blockchain'
const Getfiles = ()=>{
    const [fileList,setfileList] = useState([])
    const [account] = useOutletContext();
    //React `useEffect` is a hook function, which is invoked every time after the render job finished.
    //This function is ideal for fetching data to fill up UI. Apart from this, it can be customized through the second argument to optimize performance issue.
    //The first param is a function,which will be invoked according to the second parameter. The second param is an array containing several variables. Once a value of variable in this array changed, the function of first paramter will be invoked.
    useEffect(()=>{
        getFileList(account).then(resolve=>setfileList(resolve))
    },
    //Here I put JSON.stringify(fileList) instead of variable fileList itself, 
    //this is because fileList is an array, if we do not change it to string value to compare, each invocation of 'getFileList' will return a new array instance. So that the page will re-render infinitely,which will cause a serious performance issue.
     //The essential reason is that React consider the new instance as new value. Once React receives new value, it will re-render the page automatically.
     //So to avoid this, I convert the array to string to judge whether the value is actually changed.
    [JSON.stringify(fileList)])  
    return <div>
        Your file list:
        {(fileList === null || fileList.length === 0)? 'empty':fileList.map((item)=>convertBinaryStringToString(item.value))}
    </div>
}

export default Getfiles