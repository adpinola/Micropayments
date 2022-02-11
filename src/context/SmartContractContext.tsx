import React, { FC } from 'react';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import IMicropaymentsFactory from '../services/ethereum/IMicropaymentsFactory';
import useContractFactory from '../hooks/useContractFactory';
import useWeb3 from '../hooks/useWeb3';
// import { abi, networks } from '../assets/Subscription.json';

// const newtworkId = process.env.REACT_APP_EHTEREUM_NETWORK_ID;
const contractAddress = '0x0'; // (networks as any)[newtworkId as string].address;
const abi = [{ type: 'function' }];

const ContractFactoryContext = React.createContext<IMicropaymentsFactory | undefined>(undefined);
const MetaMaskContext = React.createContext<(() => Promise<void>) | undefined>(undefined);
const AccountContext = React.createContext<string>('');

interface ISmartContractContextProvider {
  children: React.ReactNode;
}

const SmartContractContextProvider: FC<ISmartContractContextProvider> = (props) => {
  const { web3, account, connectToMetaMask } = useWeb3();
  const contractInstance = useContractFactory(web3 as Web3, abi as AbiItem[], contractAddress);
  return (
    <AccountContext.Provider value={account}>
      <MetaMaskContext.Provider value={connectToMetaMask}>
        <ContractFactoryContext.Provider value={contractInstance}>{props.children}</ContractFactoryContext.Provider>
      </MetaMaskContext.Provider>
    </AccountContext.Provider>
  );
};

function useContractFactoryContext() {
  const context = React.useContext(ContractFactoryContext);
  if (context === undefined) {
    throw new Error('useContractFactoryContext must be used within an SmartContractContextProvider');
  }
  return context;
}

function useMetaMask() {
  const context = React.useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask must be used within an SmartContractContextProvider');
  }
  return context;
}

function useAccount() {
  const context = React.useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an SmartContractContextProvider');
  }
  return context;
}

export { SmartContractContextProvider, useContractFactoryContext, useMetaMask, useAccount };
