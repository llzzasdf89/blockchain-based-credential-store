//encapsulate some common methods,attributes to interact with blockchain
import Neon,{tx} from '@cityofzion/neon-js'
const NeoBlockchainRPCServer = "http://localhost:10332";
const contractHash = '0x59a5a00db40ace763b919499de1f4d9a167ebb76' //record the smart contract hash, which has been deployed on the blockchain.
//record the address of developer account, this is for 'Claim Gas' functionality use. To transfer gas from developer account to new registered user
const developerAccountAddress = '0xd2a4cff31913016155e38e474a2c06d08be276cf'
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
    //big number is a number class in Neonjs libary to record amount of crytocurrency.
    //Since each crytocurrency variable is firstly designed as integer type <Reference: official documentation of Neo:https://docs.neo.org/docs/zh-cn/reference/rpc/latest-version/api/getnep17balances.html>
    //for convinience, Neo designer decided to right shift this number for 8 digits:
     //for example: 1 Gas = 10000000 Gas (since number '1' ->right shift 8 digits -> '10000000')
    //therefore, in client we have to left shift this number for 8 digits to get the actual value, for display
    const bigNumber =  Neon.u.BigInteger.fromNumber(num)
    return bigNumber.toDecimal(8) //left sheft this number of 8 digits
}
const checkBalance = async (addressOfAccount)=>{
    let res = await requestBlockchainServer('openwallet',['Richard.json','llzzasdf89'])
    if(!res){
        console.error('openwallet failed, please check')
        return
    }
    res = await requestBlockchainServer('getnep17balances',[addressOfAccount])
    if(res.balance && res.balance.length > 0 ) {
        const [balance] = res.balance
        const {amount} = balance
        return convertNumberTobigNumber(amount); //if the response contains address, then it means the query is successfull and therefore we could obtain balance
    }
    else if (res.balance && res.balance.length === 0) return 0;
    throw new Error('obtain balance failed')
}
//receive a contract hash value, return the status of the corresponding contract
const getcontractstate = async ()=>{
    let res = await requestBlockchainServer('getcontractstate',[contractHash])
    if(!res) {
        console.error('getcontract state error, please check whether the contract is deployed. Or passing a wrong contract hash value?')
        return null
    }
    return res
}
//invoke the function inside the deployed contract
const invokefunctionOfContract = async (functionName,params = [],sender=[],useDiagnostic=false)=>{
    let res = await getcontractstate(contractHash)
    if(!res) return //if contract status is error, end the function
    res = await requestBlockchainServer('invokefunction',[contractHash,functionName,params,sender,useDiagnostic])
    if(!res || res.state !=='HALT') {
        console.error('invoke function failed, please check the error information')
        throw new Error(res.exception)
    }
    return res;
}

const setNetworkFee = async(signedTransaction)=>{
    //accept a transaction object, caculate the network fee and return the object after setting.
    //Note:when sending a request to get network fee, we need to sign the transaction before.
    const networkFeeResponse = await requestBlockchainServer("calculatenetworkfee",[Neon.u.HexString.fromHex(signedTransaction.serialize(true)).toBase64()])
      if (!networkFeeResponse.networkfee) {
        throw new Error("Unable to retrieve data to calculate network fee.");
      }
      signedTransaction.networkFee = Neon.u.BigInteger.fromNumber(networkFeeResponse.networkfee)
    return signedTransaction
}
const setSystemFee = async (transaction)=>{
    
    const invokeScriptResponse = await client.invokeScript(transaction.script,transaction.signers)
    if (invokeScriptResponse.state !== "HALT") {
        throw new Error(
          "Transfer script errored out! You might not have sufficient funds for this transfer."
        );
      }
      const requiredSystemFee = invokeScriptResponse.gasconsumed
    transaction.systemFee  = Neon.u.BigInteger.fromNumber(requiredSystemFee)
    return transaction
}
const createInvokeContractTransaction = async(account,functionName,functionParams = [])=>{
    const script = Neon.create.script({
        scriptHash:contractHash,
        operation:functionName,
        args:functionParams
    })
    const currentHeight = await requestBlockchainServer("getblockcount")
    //create the transaction instance, and sign it with the user's private key.
    //Note: If a transaction is not signed, we could not get Network fee. 
    let transaction = new tx.Transaction({
        signers:[
            {
                account:account._scriptHash,
                scopes:tx.WitnessScope.CalledByEntry
            }
        ],
        validUntilBlock : currentHeight + 1000,
        script
    }).sign(account._privateKey)
    transaction = await setNetworkFee(transaction)
    transaction = await setSystemFee(transaction)
    return transaction
}

const performTransaction =async(transaction,account)=>{
    //when a transaction is established, it has to be signed before sending to blockchain
    const signedTransaction = transaction.sign(account._privateKey)
    const TransactionEncryptedAfterBase64 = Neon.u.HexString.fromHex(signedTransaction.serialize(true)).toBase64()
    const res = await requestBlockchainServer('sendrawtransaction',[TransactionEncryptedAfterBase64])
    return res;
}

const getFileList = async(account)=>{
    //receive account object, output the file lists related to this account;
    const res = await invokefunctionOfContract('getFile',[{
        type:"String",
        value:account._address
    }])
    if(!res.stack || !res.stack[0].value) throw new Error('getFileList error, error info', res);
    const fileList = res.stack[0].value;
    return fileList
}

const convertBinaryStringToString = (BinaryString)=>{
    return Neon.u.base642utf8(BinaryString)
}

const claimgas = async (destinationAccount)=>{
    //Claim gas functionality, default setting is to transfer 1000 gas from developer account to destination account;

    const res = requestBlockchainServer('sendtoaddress',[developerAccountAddress,destinationAccount._address,100000000000])
    console.log(res)
    return res;
}
export {requestBlockchainServer,convertNumberTobigNumber,createInvokeContractTransaction,performTransaction,checkBalance,invokefunctionOfContract,getFileList,convertBinaryStringToString,claimgas}