import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import IMicropaymentsContract from './IMicropaymentsContract';

export default class MicropaymentsContract implements IMicropaymentsContract {
  private contractInstance: Contract;
  private userAccount: string;

  constructor(_web3: Web3, abi: AbiItem[], contractAddress: string, userAccount: string) {
    this.contractInstance = new _web3.eth.Contract(abi, contractAddress);
    this.userAccount = userAccount;
  }

  async claimPayment(): Promise<void> {
    return this.contractInstance.methods.claimPayment().call({ from: this.userAccount });
  }

  async shutdown(): Promise<void> {
    return this.contractInstance.methods.shutdown().call({ from: this.userAccount });
  }

  async getBalance(): Promise<number> {
    return this.contractInstance.methods.getBalance().call({ from: this.userAccount });
  }

  updateUserAccount(newAccount: string) {
    this.userAccount = newAccount;
  }

  onMicropaymentsCreated(from: string, callback: (data: any) => void) {
    let filter = {};
    if (from) {
      filter = {
        from,
      };
    }
    this.contractInstance.events.MicropaymentsCreated({ filter }).on('data', callback);
  }

  offMicropaymentsCreated(from: string, callback: (data: any) => void) {
    let filter = {};
    if (from) {
      filter = {
        from,
      };
    }
    this.contractInstance.events.MicropaymentsCreated({ filter }).off('data', callback);
  }

  onPaymentClaimed(from: string, callback: (data: any) => void) {
    let filter = {};
    if (from) {
      filter = {
        from,
      };
    }
    this.contractInstance.events.PaymentClaimed({ filter }).on('data', callback);
  }

  offPaymentClaimed(from: string, callback: (data: any) => void) {
    let filter = {};
    if (from) {
      filter = {
        from,
      };
    }
    this.contractInstance.events.PaymentClaimed({ filter }).off('data', callback);
  }
}
