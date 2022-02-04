import Web3 from 'web3';
import { Mixed } from 'web3-utils';
import { fromRpcSig, ecrecover, pubToAddress, stripHexPrefix } from 'ethereumjs-util';

export default class OffChainValidator {
  private _web3: Web3;
  private _contractAddress: string;
  constructor(web3: Web3, contractAddress: string) {
    this._web3 = web3;
    this._contractAddress = contractAddress;
  }

  async signTransaction(recipient: string, amount: number, nonce: number, signerAddress: string): Promise<string> {
    const hash = this.constructMessage(recipient, amount, nonce);
    return this._web3.eth.sign(hash, signerAddress); // this method is not complaiant with EIP-155: review
  }

  private constructMessage(recipient: string, amount: number, nonce: number): string {
    const valuesToSign: Mixed[] = [
      { t: 'address', v: recipient },
      { t: 'uint256', v: amount },
      { t: 'uint256', v: nonce },
      { t: 'address', v: this._contractAddress },
    ];
    const hash = this._web3.utils.soliditySha3Raw(...valuesToSign);
    return hash;
  }

  private prefixed(hash: string): Buffer {
    const valuesToSign: Mixed[] = [
      { t: 'string', v: '\x19Ethereum Signed Message:\n32' },
      { t: 'bytes32', v: hash },
    ];
    return Buffer.from(this._web3.utils.soliditySha3Raw(...valuesToSign));
  }

  // eslint-disable-next-line class-methods-use-this
  private recoverSigner(message: Buffer, signature: string): string {
    const split = fromRpcSig(signature);
    const publicKey = ecrecover(message, split.v, split.r, split.s);
    const signer = pubToAddress(publicKey).toString('hex');
    return signer;
  }

  isValidSignature(recipient: string, amount: number, nonce: number, signature: string, expectedSigner: string): boolean {
    const message = this.prefixed(this.constructMessage(recipient, amount, nonce));
    const signer = this.recoverSigner(message, signature);
    return signer.toLowerCase() === stripHexPrefix(expectedSigner).toLowerCase();
  }
}
