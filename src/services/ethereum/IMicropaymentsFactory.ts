import IBaseContract from './IBaseContract';
import { MicropaymentsData } from './MicropaymentsDataType';

export default interface IMicropaymentsFactory extends IBaseContract {
  createMicropayment: (name: string, value: string) => Promise<void>;
  getMicropaymentsContracts: () => Promise<Array<MicropaymentsData>>;
  getMicropaymentsContractAddress: (name: string) => Promise<string>;
  onMicropaymentsCreated(from: string, callback: (data: any) => void): void;
  offMicropaymentsCreated(from: string, callback: (data: any) => void): void;
  deleteContract: (location: string) => Promise<void>;
}
