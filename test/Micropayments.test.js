/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const Micropayments = artifacts.require('./Micropayments.sol');
const timeMachine = require('ganache-time-traveler');

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
});
