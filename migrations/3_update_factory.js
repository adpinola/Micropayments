/* eslint-disable no-undef */
const MicropaymentsFactory = artifacts.require('../contracts/MicropaymentsFactory.sol');

const deploy = async (deployer) => {
  await deployer.deploy(MicropaymentsFactory);
};

module.exports = deploy;
