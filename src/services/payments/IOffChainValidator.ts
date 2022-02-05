export default interface IOffChainValidator {
  signTransaction(recipient: string, amount: number, nonce: number, signerAddress: string): Promise<string>;
  isValidSignature(recipient: string, amount: number, nonce: number, signature: string, expectedSigner: string): boolean;
}
