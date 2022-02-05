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

  it('emit a MicropaymentsCreated event with data', async () => {
    const { transactionHash } = contractUnderTest;
    const transactionResult = await truffleAssert.createTransactionResult(contractUnderTest, transactionHash);
    truffleAssert.eventEmitted(transactionResult, 'MicropaymentsCreated', (ev) => {
      return ev.from === owner && ev.name === contractName && ev.value.toString() === initialValue;
    });
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
});
