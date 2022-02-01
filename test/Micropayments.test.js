/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const Micropayments = artifacts.require('./Micropayments.sol');
const timeMachine = require('ganache-time-traveler');

const { subscriptionValue, durationInMinutes } = require('../environment.json');

contract('Micropayments Contract should', (accounts) => {
  let contractUnderTest;
  let owner;
  let subscriber;
  let snapshotId;

  beforeEach(async () => {
    const snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot.result;
    [owner, subscriber] = accounts;
    contractUnderTest = await Micropayments.new(subscriptionValue, durationInMinutes, { from: owner });
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(snapshotId);
  });

  it("return owner's address", async () => {
    const ownerAddress = await contractUnderTest.owner.call({ from: owner });
    expect(ownerAddress).to.equal(owner);
  });

  it('return balance 0 by default', async () => {
    const balance = await contractUnderTest.getBalance.call({ from: owner });
    expect(balance.toNumber()).to.equal(0);
  });
});
