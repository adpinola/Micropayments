import BaseContract from './BaseContract';
import IMicropaymentsContract from './IMicropaymentsContract';

export default class MicropaymentsContract extends BaseContract implements IMicropaymentsContract {
  async claimPayment(amount: string, nonce: number, signature: string): Promise<void> {
    return this.contractInstance.methods.claimPayment(amount, nonce, signature).send({ from: this.userAccount });
  }

  async getBalance(): Promise<string> {
    return this.contractInstance.methods.getBalance().call({ from: this.userAccount });
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
