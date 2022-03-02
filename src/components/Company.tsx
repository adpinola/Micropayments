import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Modal, FloatingLabel, FormControl, InputGroup, Toast, Form, Spinner } from 'react-bootstrap';
import { FaRegPlusSquare } from 'react-icons/fa';
import { toWei } from 'web3-utils';
import { CreateMicropaymentData } from '../assets/formData/CreateMicropaymentData';
import { useAccount, useContractFactoryContext, useMetaMask } from '../context/SmartContractContext';
import { MicropaymentsData } from '../services/ethereum/MicropaymentsDataType';
import '../styles/Company.scss';
import ContractsTable from './ContractsTable';
import MetaMaskIcon from './MetaMaskIcon';
import { ClaimInfo } from '../assets/formData/ClaimInfo';
import ContractDetails from './ContractDetails';
import SignatureDetailsModal from './SignatureDetailsModal';

enum WalletStatus {
  Locked = 'Locked',
  Connected = 'Connected',
}

const Company: FC = () => {
  const [claimInfo, setClaimInfo] = useState<ClaimInfo>({ amount: '0', claimerAddress: '0x0', contractAddress: '0x0', nonce: 0, signature: '0x0' });
  const [micropaymentInstanceData, setMicropaymentInstanceData] = useState<MicropaymentsData>({ location: '0x0', name: '' });
  const [availableContracts, setAvailableContracts] = useState<Array<MicropaymentsData>>([]);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(WalletStatus.Locked);
  const [showDetails, setShowDetails] = useState(false);
  const [creatingContract, setCreatingContract] = useState(false);
  const [signOrder, setSignOrder] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [createSpinner, setCreateSpinner] = useState(false);
  const connect = useMetaMask();
  const account = useAccount();
  const contractFactory = useContractFactoryContext();

  // #region Get Contracts
  const refreshAvilableContracts = useCallback(async () => {
    const contracts = await contractFactory.getMicropaymentsContracts();
    setAvailableContracts(contracts);
  }, [contractFactory]);

  useEffect(() => {
    if (walletStatus === WalletStatus.Connected) refreshAvilableContracts();
  }, [refreshAvilableContracts, walletStatus]);
  // #endregion

  // #region Account Change
  useEffect(() => {
    const onAccountChange = async () => {
      if (!account || !contractFactory) {
        setShowToast(false);
        setWalletStatus(WalletStatus.Locked);
        return;
      }
      if (!(await contractFactory.isOwner(account))) {
        setShowToast(true);
        setWalletStatus(WalletStatus.Locked);
        return;
      }
      contractFactory.updateUserAccount(account);
      contractFactory.onMicropaymentsCreated(account, () => {
        setCreateSpinner(false);
        setCreatingContract(false);
        refreshAvilableContracts();
      });
      setShowToast(false);
      setWalletStatus(WalletStatus.Connected);
    };

    onAccountChange();
  }, [account, contractFactory, refreshAvilableContracts]);
  // #endregion

  // #region Instance Selected
  const onSelectContract = (contractData: MicropaymentsData) => {
    setMicropaymentInstanceData(contractData);
    setShowDetails(true);
  };
  // #endregion

  // #region Instance actions
  const depositToInstance = () => {
    console.error('deposit eth to this contract is not yet implemented');
  };

  const deleteInstance = async (address: string) => {
    await contractFactory.deleteContract(address);
    setShowDetails(false);
    refreshAvilableContracts();
  };

  const onSignConfirm = (claim: ClaimInfo) => {
    setClaimInfo(claim);
    setSignOrder(true);
  };
  // #endregion

  // #region Create Contract
  const onCreateContract = () => {
    setCreatingContract(true);
  };

  const onConfirmCreate = async (event: any) => {
    try {
      event.preventDefault();
      setCreateSpinner(true);
      const { name, value } = Object.fromEntries(new FormData(event.target)) as unknown as CreateMicropaymentData;
      await contractFactory.createMicropayment(name, toWei(value));
    } catch (e) {
      console.log(e);
      setCreateSpinner(false);
    }
  };
  // #endregion

  return (
    <div id="company">
      <div className="content">
        <div className="table-container">
          <div className="actions-container">
            <Button variant="primary" className="d-flex justify-content-center align-items-center" onClick={onCreateContract}>
              <FaRegPlusSquare />
              <div>Create a Contract</div>
            </Button>
          </div>
          <ContractsTable contractData={availableContracts} rowSelectedCallback={onSelectContract} />
        </div>
        {showDetails && (
          <div id="contract-side-card">
            <ContractDetails
              closeCallback={() => setShowDetails(false)}
              onSignConfirm={onSignConfirm}
              onDeposit={depositToInstance}
              onDelete={deleteInstance}
              data={micropaymentInstanceData}
            />
          </div>
        )}
      </div>
      <Modal show={walletStatus === WalletStatus.Locked} centered>
        <Modal.Body className="text-center">
          <div>Please, connnect your wallet to continue.</div>
          {showToast ? (
            <Toast className="d-inline-block m-1" bg="danger">
              <Toast.Body>
                <strong>Your are not the owner of this company, please select another account.</strong>
              </Toast.Body>
            </Toast>
          ) : null}
        </Modal.Body>
        {!showToast && (
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="primary" onClick={connect} className="d-flex">
              <MetaMaskIcon />
              <div>Connect with MetaMask</div>
            </Button>
          </Modal.Footer>
        )}
      </Modal>
      <Modal show={creatingContract} onHide={() => setCreatingContract(false)} centered>
        <Form onSubmit={onConfirmCreate}>
          <Modal.Header closeButton>
            <Modal.Title>New Contract</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel label="Contract Name" className="mb-3">
              <FormControl name="name" placeholder="choose a name..." required />
            </FloatingLabel>
            <InputGroup className="mb-3">
              <FormControl name="value" placeholder="0.0000" required />
              <InputGroup.Text>ETH</InputGroup.Text>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">
              {createSpinner ? <Spinner animation="border" as="span" size="sm" /> : null}
              &nbsp;Confirm&nbsp;
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <SignatureDetailsModal claimInfo={claimInfo} show={signOrder} onClose={() => setSignOrder(false)} />
    </div>
  );
};

export default Company;
