import Web3 from 'web3';
import { Mixed } from 'web3-utils';

export default class OffChainSigner {
  private _web3: Web3;
  private _contractAddress: string;
  constructor(web3: Web3, contractAddress: string) {
    this._web3 = web3;
    this._contractAddress = contractAddress;
  }

  async signTransaction(recipient: string, amount: number, nonce: number, signerAddress: string): Promise<string> {
    const valuesToSign: Mixed[] = [
      { t: 'address', v: recipient },
      { t: 'uint256', v: amount },
      { t: 'uint256', v: nonce },
      { t: 'address', v: this._contractAddress }
    ];
    var hash = this._web3.utils.soliditySha3Raw(...valuesToSign);
    return this._web3.eth.sign(hash, signerAddress);
  }
}
