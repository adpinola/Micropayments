/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const MicropaymentsFactory = artifacts.require('./MicropaymentsFactory.sol');
const Micropayments = artifacts.require('./Micropayments.sol');
const truffleAssert = require('truffle-assertions');

contract('MicropaymentsFactory Contract should', (accounts) => {
  const micropaymentContractName = 'OWNER <> CLAIMER';
  const micropaymentContractInitialValue = '1000000000000000000';
  let contractUnderTest;
  let owner;

  beforeEach(async () => {
    [owner] = accounts;
    contractUnderTest = await MicropaymentsFactory.new({ from: owner });
  });

  it("return owner's address", async () => {
    const ownerAddress = await contractUnderTest.owner.call({ from: owner });
    expect(ownerAddress).to.equal(owner);
  });

  it('emit a MicropaymentsCreated event when creation suceeds', async () => {
    const transactionResult = await contractUnderTest.createMicropayment(micropaymentContractName, {
      from: owner,
      value: micropaymentContractInitialValue,
    });
    truffleAssert.eventEmitted(transactionResult, 'MicropaymentsCreated', (ev) => {
      return ev.from === owner && ev.name === micropaymentContractName && ev.value.toString() === micropaymentContractInitialValue;
    });
  });

  it("return the new created contract's address, and it's balance should match with the value passed on creation", async () => {
    await contractUnderTest.createMicropayment(micropaymentContractName, {
      from: owner,
      value: micropaymentContractInitialValue,
    });

    const micropaymentsContractAddress = await contractUnderTest.getMicropaymentsContractAddress.call(micropaymentContractName, { from: owner });
    const micropaymentsContractBalance = await web3.eth.getBalance(micropaymentsContractAddress);

    expect(micropaymentsContractBalance).to.equal(micropaymentContractInitialValue);
  });

  it('transfer ownership of the newly created contract to the account that made the request', async () => {
    await contractUnderTest.createMicropayment(micropaymentContractName, {
      from: owner,
      value: micropaymentContractInitialValue,
    });

    const micropaymentsContractAddress = await contractUnderTest.getMicropaymentsContractAddress.call(micropaymentContractName, { from: owner });
    const createdContract = await Micropayments.at(micropaymentsContractAddress);

    const createdContractOwner = await createdContract.owner.call({ from: owner });
    expect(createdContractOwner).to.equal(owner);
  });

  it('return the list of created contracts', async () => {
    await contractUnderTest.createMicropayment(micropaymentContractName, {
      from: owner,
      value: micropaymentContractInitialValue,
    });

    await contractUnderTest.createMicropayment('Another Contract', {
      from: owner,
      value: micropaymentContractInitialValue,
    });

    const micropaymentsContracts = await contractUnderTest.getMicropaymentsContracts.call({ from: owner });
    expect(micropaymentsContracts.length).to.equal(2);
  });

  it('deny and revert the transaction if a contract with that name already exists', async () => {
    const ERROR_REASON = '[Factory] Name already exists';
    await contractUnderTest.createMicropayment(micropaymentContractName, {
      from: owner,
      value: micropaymentContractInitialValue,
    });

    try {
      await contractUnderTest.createMicropayment(micropaymentContractName, {
        from: owner,
        value: micropaymentContractInitialValue,
      });
    } catch (error) {
      expect(error.reason).to.equal(ERROR_REASON);
    }
  });
});
