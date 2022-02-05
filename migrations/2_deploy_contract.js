/* eslint-disable no-undef */
const Micropayments = artifacts.require('../contracts/Micropayments.sol');
const MicropaymentsFactory = artifacts.require('../contracts/MicropaymentsFactory.sol');

const deploy = async (deployer) => {
  await deployer.deploy(Micropayments, 'ME <> Ganache');
  await deployer.deploy(MicropaymentsFactory);
};

module.exports = deploy;
