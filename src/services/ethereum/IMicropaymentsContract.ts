import IBaseContract from './IBaseContract';

export default interface IMicropaymentsContract extends IBaseContract {
  claimPayment: (amount: string, nonce: number, signature: string) => Promise<void>;
  getBalance: () => Promise<number>;
  shutdown: () => Promise<void>;
}
