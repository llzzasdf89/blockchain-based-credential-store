import { SmartContract,MapStorage,Address,constant} from '@neo-one/smart-contract';
export class  Storage extends SmartContract {
    //This is the variable maintaining all the file Hash received from client
    private readonly fileHashs = MapStorage.for<Address,Array<string>>();
    //set Method
    public setFileHash(addr:Address,fileHash:string):boolean{
        //when received transaction for uploading documents, get the array and push the item inside it .
        if(!addr || !fileHash ) return false
        let fileHashs = this.fileHashs.get(addr)
        if(!fileHashs) {
            fileHashs = []
            fileHashs.push(fileHash)
        }
        else fileHashs.push(fileHash)
        this.fileHashs.set(addr,fileHashs)
        return true;
    }
    @constant
    public getFileHash(addr:Address):Array<string>{
        //get all the file hashs of a client
        const fileHashs = this.fileHashs.get(addr)
        if(!fileHashs) return []
        return fileHashs
    }

}