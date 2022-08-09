using System;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Services;

namespace Storage
{
    [ManifestExtra("Author", "RichardZhiLi")]
    [ManifestExtra("Email", "ZhiLi17@163.com")]
    [ManifestExtra("Description", "This contract is for file hash storage")]
    [SupportedStandards("NEP-17")]
    [ContractPermission("*", "onNEP17Payment")]
    public class Storage : SmartContract
    {
         static readonly UInt160 Owner = default; //default value is the developer of contract's address
        private static StorageMap files = new StorageMap(Neo.SmartContract.Framework.Services.Storage.CurrentContext,(ByteString)"files");
        private static bool IsOwner() => Runtime.CheckWitness(Owner);

        //generally we use the account address as the key, and the fileHash returned from IPFS as value. We just store this key-value map in the blockchain
        public static Boolean setFile(String accountAddress, String fileName,String fileHash, UInt64 timestamp){
            File[] res = getFile(accountAddress);
            if(res.Length == 0 ){
                res = new File[1];
                File tmp = new File(fileName,fileHash,timestamp);
                res[0] = tmp;
                files.PutObject(accountAddress,res);
                return true;
            }
            for(int i = 0; i < res.Length; i++){
                //duplicate file, do not store it.
                if(res[i].getFileHash() == fileHash) return false;
            }
            File[] tmpArr = new File[res.Length + 1];
            for(int i = 0 ; i < res.Length ; i++) tmpArr[i] = res[i];
            tmpArr[tmpArr.Length - 1] = new File(fileName,fileHash,timestamp);
            return true;
        }
        public static File[] getFile(String accountAddress){
            File[] res = (File[])files.GetObject(accountAddress)??new File[0];
            return res;
        }
        // When this contract address is included in the transaction signature,
        // this method will be triggered as a VerificationTrigger to verify that the signature is correct.
        // For example, this method needs to be called when withdrawing token from the contract.
        public static bool Verify() => IsOwner();
    }
    public class File {
        private String fileName;
        private String fileHash;
        private UInt64 uploadTimeStamp;
        public File(String fileName, String fileHash, UInt64 uploadTimeStamp){
            this.fileHash= fileHash;
            this.fileName = fileName;
            this.uploadTimeStamp = uploadTimeStamp;
        }
        public String getFileHash (){
            return this.fileHash;
        }
    }
}
