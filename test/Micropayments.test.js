/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const Micropayments = artifacts.require('./Micropayments.sol');
const timeMachine = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const OffChainValidator = require('./utils/OffChain');

contract('Micropayments Contract should', (accounts) => {
  const contractName = 'OWNER <> CLAIMER';
  const initialValue = '1000000000000000000';
  let contractUnderTest;
  let owner;
  let claimer;
  let snapshotId;

  beforeEach(async () => {
    const snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot.result;
    [owner, claimer] = accounts;
    contractUnderTest = await Micropayments.new(contractName, { from: owner, value: initialValue });
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(snapshotId);
  });

  it("return owner's address", async () => {
    const ownerAddress = await contractUnderTest.owner.call({ from: owner });
    expect(ownerAddress).to.equal(owner);
  });

  it('return balance passed on creation by default', async () => {
    const balance = await contractUnderTest.getBalance.call({ from: owner });
    expect(balance.toString()).to.equal(initialValue);
  });

  it('pay the allowed amount to claimer if signature matche', async () => {
    const offChainValidator = new OffChainValidator(web3, contractUnderTest.address);
    const allowance = '10000000000';
    const nonce = Date.now();
    const signature = await offChainValidator.signTransaction(claimer, allowance, nonce, owner);
    const transactionResult = await contractUnderTest.claimPayment(allowance, nonce, signature, { from: claimer });

    truffleAssert.eventEmitted(transactionResult, 'PaymentClaimed', (ev) => {
      return ev.from === claimer && ev.name === contractName;
    });
  });

  it('deny and revert the transaction if the signature was already used', async () => {
    const ERROR_REASON = 'Claim already done';
    const offChainValidator = new OffChainValidator(web3, contractUnderTest.address);
    const allowance = '10000000000';
    const nonce = Date.now();
    const signature = await offChainValidator.signTransaction(claimer, allowance, nonce, owner);
    await contractUnderTest.claimPayment(allowance, nonce, signature, { from: claimer });

    try {
      await contractUnderTest.claimPayment(allowance, nonce, signature, { from: claimer });
      expect(false).to.equal(true);
    } catch (error) {
      expect(error.reason).to.equal(ERROR_REASON);
    }
  });

  it('deny and revert the transaction if the signature was issued by a different account', async () => {
    const ERROR_REASON = 'Signature is invalid [owner]';
    const offChainValidator = new OffChainValidator(web3, contractUnderTest.address);
    const allowance = '10000000000';
    const nonce = Date.now();
    const signature = await offChainValidator.signTransaction(claimer, allowance, nonce, claimer);
    try {
      await contractUnderTest.claimPayment(allowance, nonce, signature, { from: claimer });
      expect(false).to.equal(true);
    } catch (error) {
      expect(error.reason).to.equal(ERROR_REASON);
    }
  });

  it('deny and revert the transaction if the signature has invalid length', async () => {
    const ERROR_REASON = 'Signature is invalid [length]';
    const allowance = '10000000000';
    const nonce = Date.now();

    try {
      await contractUnderTest.claimPayment(allowance, nonce, '0x000000', { from: claimer });
      expect(false).to.equal(true);
    } catch (error) {
      expect(error.reason).to.equal(ERROR_REASON);
    }
  });

  it('deny and revert the transaction if the signature has invalid format v: 0xff ', async () => {
    const ERROR_REASON = 'Signature is invalid [format]';
    const r = 'c45f1e97dae24bd47943c4f2344db92db728a2f80d2294555985d90260f6327b';
    const s = '3c68bb237b52069cb652a7004354342b9ff9276e0ff95a47a1217a16f2fec5ed';
    const v = 'ff';
    const allowance = '10000000000';
    const nonce = Date.now();

    try {
      await contractUnderTest.claimPayment(allowance, nonce, `0x${r}${s}${v}`, { from: claimer });
      expect(false).to.equal(true);
    } catch (error) {
      expect(error.reason).to.equal(ERROR_REASON);
    }
  });

  it('allow calling shutdown() if the contract creator attempts', async () => {
    await contractUnderTest.shutdown({ from: owner });
    const contractBalance = await web3.eth.getBalance(contractUnderTest.address);
    expect(contractBalance).to.equal('0');
  });

  it('deny calling shutdown() if anyone else attempts', async () => {
    const ERROR_REASON = 'Caller is not the creator';
    try {
      await contractUnderTest.shutdown({ from: claimer });
      expect(false).to.equal(true);
    } catch (error) {
      expect(error.reason).to.equal(ERROR_REASON);
    }
  });
});
