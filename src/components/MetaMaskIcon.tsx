import React, { FC } from 'react';
import MetaMask from '../assets/metamask.svg';
import '../styles/MetaMaskIcon.scss';

const MetaMaskIcon: FC = () => {
  return <img src={MetaMask} id="metamask-icon" alt="MetaMask" />;
};

export default MetaMaskIcon;
