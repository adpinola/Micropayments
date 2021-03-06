module.exports = class OffChainValidator {
  _web3;
  _contractAddress;
  constructor(web3, contractAddress) {
    this._web3 = web3;
    this._contractAddress = contractAddress;
  }

  async signTransaction(recipient, amount, nonce, signerAddress) {
    const hash = this.constructMessage(recipient, amount, nonce);
    // ToDo: replace with web3.eth.personal.sign
    return this._web3.eth.sign(hash, signerAddress);
  }

  constructMessage(recipient, amount, nonce) {
    const valuesToSign = [
      { t: 'address', v: recipient },
      { t: 'uint256', v: amount },
      { t: 'uint256', v: nonce },
      { t: 'address', v: this._contractAddress },
    ];
    const hash = this._web3.utils.soliditySha3Raw(...valuesToSign);
    return hash;
  }
};
