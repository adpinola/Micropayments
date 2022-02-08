import { useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import MicropaymentsFactory from '../services/ethereum/MicropaymentsFactory';
import IMicropaymentsFactory from '../services/ethereum/IMicropaymentsFactory';

const useContractFactory = (provider: Web3, abi: AbiItem[], address: string) => {
  const [contractInstance] = useState<IMicropaymentsFactory>(new MicropaymentsFactory(provider, abi, address));
  return contractInstance;
};

export default useContractFactory;
