import BaseContract from './BaseContract';
import IMicropaymentsFactory from './IMicropaymentsFactory';

export default class MicropaymentsFactory extends BaseContract implements IMicropaymentsFactory {
  async createMicropayment(name: string, value: number): Promise<void> {
    return this.contractInstance.methods.createMicropayment(name, { from: this.userAccount, value });
  }

  async getMicropaymentsContracts(): Promise<Array<string>> {
    return this.contractInstance.methods.getMicropaymentsContracts.call({ from: this.userAccount });
  }

  async getMicropaymentsContractAddress(name: string): Promise<string> {
    return this.contractInstance.methods.getMicropaymentsContractAddress.call(name, { from: this.userAccount });
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
}
