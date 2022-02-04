/* eslint-disable no-undef */
const Micropayments = artifacts.require('../contracts/Micropayments.sol');

const deploy = async (deployer) => {
  await deployer.deploy(Micropayments, 'ME <> Ganache');
};

module.exports = deploy;
