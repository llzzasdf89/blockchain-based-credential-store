using Neo;
using Neo.SmartContract;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;
using System;

namespace Storage
{
    [ManifestExtra("Author", "RichardZhiLi")]
    [ManifestExtra("Email", "ZhiLi17@163.com")]
    [ManifestExtra("Description", "This contract is for file hash storage")]
    [SupportedStandards("NEP-17")]
    [ContractPermission("*", "onNEP17Payment")]
    public class Storage : SmartContract
    {
        //TODO: Replace it with your own address.
        [InitialValue("NiNmXL8FjEUEs1nfX9uHFBNaenxDHJtmuB", ContractParameterType.Hash160)]
        static readonly UInt160 Owner = default; //default value is the developer of contract's address
        StorageMap fileHashs = new(Storage.CurrentContext, nameof(fileHashs));
        private static bool IsOwner() => Runtime.CheckWitness(Owner);

        public static Boolean setfileHash (String address, String filehash){
            byte[] res = this.fileHashs.Get(address);
            if(res.Length == 0 || res == null) {
                // if this array does not exist, create it and store the hash value inside it.
                res = new byte[1];
                res[0] = filehash;
                this.fileHashs.Put(address,res);
                return true;
                }
            byte[] tmp = new byte[res.Length + 1];
            res.CopyTo(tmp,0);
            tmp[tmp.Length - 1] = filehash;
            this.fileHashs.Put(address,res);
            return true;
        }
        public static byte[] getfileHash(String address){
            byte[] res = this.fileHashs.Get(address)?new byte[0]:this.fileHashs.Get(address);
            return res;
        }
        // When this contract address is included in the transaction signature,
        // this method will be triggered as a VerificationTrigger to verify that the signature is correct.
        // For example, this method needs to be called when withdrawing token from the contract.
        public static bool Verify() => IsOwner();

        
    }
}