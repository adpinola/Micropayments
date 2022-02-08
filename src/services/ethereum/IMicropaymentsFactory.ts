import IBaseContract from './IBaseContract';

export default interface IMicropaymentsFactory extends IBaseContract {
  createMicropayment: (name: string, value: number) => Promise<void>;
  getMicropaymentsContracts: () => Promise<Array<string>>;
  getMicropaymentsContractAddress: (name: string) => Promise<string>;
}
