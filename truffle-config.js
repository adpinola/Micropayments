const HDWalletProvider = require('@truffle/hdwallet-provider');
const { mnemonic, endpoint } = require('./environment.json').rinkeby;

module.exports = {
  contracts_build_directory: './src/assets',
  networks: {
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: 5777,
      gas: 3000000,
      from: '__LOCAL_ACCOUNT__',
    },
    rinkeby: {
      provider() {
        return new HDWalletProvider(mnemonic, endpoint);
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    },
  },
  compilers: {
    solc: {
      version: '^0.8.10',
    },
  },
  plugins: ['solidity-coverage'],
};
