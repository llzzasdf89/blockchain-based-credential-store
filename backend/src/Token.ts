import {SmartContract} from '@neo-one/smart-contract';
export class Token extends SmartContract {
   public action(): boolean {
      console.log('trigger action')
      return true;
    }
}