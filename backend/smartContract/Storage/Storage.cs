using System;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Attributes;
using Neo.SmartContract.Framework.Services;
using Neo.SmartContract.Framework.Native;

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

        public static Boolean setfileHash (String address, String filehash){
            string[] res = (string[])StdLib.Deserialize(fileHashs.Get(address))??new string[0];
            if(res.Length == 0) {
                res = new string[1];
                res[0] = filehash;
                fileHashs.Put(address,StdLib.Serialize(res));
                return true;
            }
            string[] tmp = new string[res.Length+1];
            //copy the array;Note in the Smart Contract, it does not support array.clone or array.copy. We could only copy an array in this way
            for(int i = 0 ; i < res.Length; i++) tmp[i] = res[i]; 
            tmp[tmp.Length - 1] = filehash;
            fileHashs.Put(address,StdLib.Serialize(tmp));
            return true;
        }
        public static string[] getfileHash(String address){
            string[] res = (string[])StdLib.Deserialize(fileHashs.Get(address))??new string[0];
            return res;
        }
        // When this contract address is included in the transaction signature,
        // this method will be triggered as a VerificationTrigger to verify that the signature is correct.
        // For example, this method needs to be called when withdrawing token from the contract.
        public static bool Verify() => IsOwner();
    }
}
