import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import IBaseContract from './IBaseContract';

export default class BaseContract implements IBaseContract {
  contractInstance: Contract;
  userAccount: string;

  constructor(_web3: Web3, abi: AbiItem[], contractAddress: string, userAccount = '') {
    this.contractInstance = new _web3.eth.Contract(abi, contractAddress);
    this.userAccount = userAccount;
  }

  updateUserAccount(newAccount: string) {
    this.userAccount = newAccount;
  }

  async isOwner(account: string): Promise<boolean> {
    const currentOwner = await this.contractInstance.methods.owner().call({ from: account });
    return currentOwner.toLocaleUpperCase() === account.toLocaleUpperCase();
  }
}
