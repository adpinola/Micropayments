import { Contract } from 'web3-eth-contract';

export default interface IBaseContract {
  contractInstance: Contract;
  userAccount: string;
  instanceAddress: string;

  updateUserAccount: (newAccount: string) => void;
  isOwner: (account: string) => Promise<boolean>;
}
