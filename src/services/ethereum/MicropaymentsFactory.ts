import BaseContract from './BaseContract';
import IMicropaymentsFactory from './IMicropaymentsFactory';
import { MicropaymentsData } from './MicropaymentsDataType';

export default class MicropaymentsFactory extends BaseContract implements IMicropaymentsFactory {
  async createMicropayment(name: string, value: string): Promise<void> {
    return this.contractInstance.methods.createMicropayment(name).send({ from: this.userAccount, value });
  }

  async getMicropaymentsContracts(): Promise<Array<MicropaymentsData>> {
    return this.contractInstance.methods.getMicropaymentsContracts().call({ from: this.userAccount });
  }

  async getMicropaymentsContractAddress(name: string): Promise<string> {
    return this.contractInstance.methods.getMicropaymentsContractAddress(name).call({ from: this.userAccount });
  }

  updateUserAccount(newAccount: string) {
    this.userAccount = newAccount;
  }

  deleteContract(location: string) {
    return this.contractInstance.methods.deleteContract(location).send({ from: this.userAccount });
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
