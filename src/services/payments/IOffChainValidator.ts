export default interface IOffChainValidator {
  signTransaction(recipient: string, amount: string, nonce: number, signerAddress: string): Promise<string>;
  isValidSignature(recipient: string, amount: string, nonce: number, signature: string, expectedSigner: string): boolean;
}
