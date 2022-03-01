import Web3 from 'web3';
import { fromRpcSig, ecrecover, pubToAddress, stripHexPrefix } from 'ethereumjs-util';
import { soliditySHA3 } from 'ethereumjs-abi';
import IOffChainValidator from './IOffChainValidator';

export default class OffChainValidator implements IOffChainValidator {
  private _web3: Web3;
  private _contractAddress: string;
  constructor(web3: Web3, contractAddress: string) {
    this._web3 = web3;
    this._contractAddress = contractAddress;
  }

  async signTransaction(recipient: string, amount: string, nonce: number, signerAddress: string): Promise<string> {
    const hash = this.constructMessage(recipient, amount, nonce);
    return this._web3.eth.personal.sign(`0x${hash.toString('hex')}`, signerAddress, '');
  }

  isValidSignature(recipient: string, amount: string, nonce: number, signature: string, expectedSigner: string): boolean {
    const message = OffChainValidator.prefixed(this.constructMessage(recipient, amount, nonce));
    const signer = OffChainValidator.recoverSigner(message, signature);
    return signer.toLowerCase() === stripHexPrefix(expectedSigner).toLowerCase();
  }

  private constructMessage(recipient: string, amount: string, nonce: number): Buffer {
    return soliditySHA3(['address', 'uint256', 'uint256', 'address'], [recipient, amount, nonce, this._contractAddress]);
  }

  private static prefixed(hash: Buffer): Buffer {
    return soliditySHA3(['string', 'bytes32'], ['\x19Ethereum Signed Message:\n32', `0x${hash.toString('hex')}`]);
  }

  private static recoverSigner(message: Buffer, signature: string): string {
    const split = fromRpcSig(signature);
    const publicKey = ecrecover(message, split.v, split.r, split.s);
    const signer = pubToAddress(publicKey).toString('hex');
    return signer;
  }
}
