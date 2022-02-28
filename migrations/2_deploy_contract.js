/* eslint-disable no-undef */
const Micropayments = artifacts.require('../contracts/Micropayments.sol');
const MicropaymentsFactory = artifacts.require('../contracts/MicropaymentsFactory.sol');

const isTestEnvironment = process.env.TRUFFLE_ENV === 'test';

const deploy = async (deployer) => {
  if (isTestEnvironment) await deployer.deploy(Micropayments, 'ME <> Ganache');
  await deployer.deploy(MicropaymentsFactory);
};

module.exports = deploy;
