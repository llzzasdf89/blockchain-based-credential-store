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
        private static StorageMap fileHashs = new StorageMap(Neo.SmartContract.Framework.Services.Storage.CurrentContext,(ByteString)"fileHashs");
        private static bool IsOwner() => Runtime.CheckWitness(Owner);

        //generally we use the account address as the key, and the fileHash returned from IPFS as value. We just store this key-value map in the blockchain
        public static Boolean setfileHash (String address, String filehash){
            //before set the map, try to get the key-value first, because it may exist previously
            string[] res = getfileHash(address);
            //if the array length is 0, which means this key-value does not exist.
            if(res.Length == 0) {
                res = new string[1];
                res[0] = filehash;
                fileHashs.PutObject(address,res);
                return true;
            }
            string[] tmp = new string[res.Length+1];
            //else we need to copy the array;Note in the Smart Contract, it does not support array.clone or array.copy. We could only copy an array in this way
            for(int i = 0 ; i < res.Length; i++) tmp[i] = res[i]; 
            tmp[tmp.Length - 1] = filehash;
            fileHashs.PutObject(address,tmp);
            return true;
        }
        public static string[] getfileHash(String address){
            string[] res = (string[])fileHashs.GetObject(address)??new String[0];
            return res;
        }
        // When this contract address is included in the transaction signature,
        // this method will be triggered as a VerificationTrigger to verify that the signature is correct.
        // For example, this method needs to be called when withdrawing token from the contract.
        public static bool Verify() => IsOwner();
    }
}
