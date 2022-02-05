export default interface IMicropaymentsContract {
  claimPayment: (from: string, value: number) => Promise<void>;
  getBalance: (from: string) => Promise<number>;
  shutdown: (from: string) => Promise<void>;
}
