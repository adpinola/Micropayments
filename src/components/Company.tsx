/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Modal,
  CloseButton,
  Tooltip,
  OverlayTrigger,
  FloatingLabel,
  FormControl,
  InputGroup,
  Accordion,
  Toast,
  Form,
  Spinner,
} from 'react-bootstrap';
import { FaCopy, FaMoneyBillAlt, FaRegPlusSquare, FaTrash } from 'react-icons/fa';
import { AbiItem, toWei, fromWei } from 'web3-utils';
import { CreateMicropaymentData } from '../assets/formData/CreateMicropaymentData';
import { useAccount, useContractFactoryContext, useMetaMask } from '../context/SmartContractContext';
import useWeb3 from '../hooks/useWeb3';
import IMicropaymentsContract from '../services/ethereum/IMicropaymentsContract';
import MicropaymentsContract from '../services/ethereum/MicropaymentsContract';
import { MicropaymentsData } from '../services/ethereum/MicropaymentsDataType';
import '../styles/Company.scss';
import ContractsTable from './ContractsTable';
import MetaMaskIcon from './MetaMaskIcon';
import { abi } from '../assets/Micropayments.json';

enum WalletStatus {
  Locked = 'Locked',
  Connected = 'Connected',
}

const Company: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [instanceBalance, setInstanceBalance] = useState<string>('');
  const [instanceAddress, setInstanceAddress] = useState<string>('');
  const [instanceName, setInstanceName] = useState<string>('');
  const [availableContracts, setAvailableContracts] = useState<Array<MicropaymentsData>>([]);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(WalletStatus.Locked);
  const [showDetails, setShowDetails] = useState(false);
  const [creatingContract, setCreatingContract] = useState(false);
  const [signOrder, setSignOrder] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [createSpinner, setCreateSpinner] = useState(false);
  const [micropaymentInstance, setMicropaymentInstance] = useState<IMicropaymentsContract>();
  const connect = useMetaMask();
  const account = useAccount();
  const contractFactory = useContractFactoryContext();
  const { web3 } = useWeb3();

  // #region Account Change
  useEffect(() => {
    const onAccountChange = async () => {
      if (!account || !contractFactory) {
        setShowToast(false);
        setWalletStatus(WalletStatus.Locked);
        return;
      }
      if (!(await contractFactory.isOwner(account))) {
        console.log('You are not the owner of this factory...');
        setShowToast(true);
        setWalletStatus(WalletStatus.Locked);
        return;
      }
      contractFactory.updateUserAccount(account);
      setShowToast(false);
      setWalletStatus(WalletStatus.Connected);
    };

    onAccountChange();
  }, [account, contractFactory]);
  // #endregion

  // #region Get Contracts
  const refreshAvilableContracts = useCallback(async () => {
    debugger;
    const contracts = await contractFactory.getMicropaymentsContracts();
    console.log(contracts, contractFactory.userAccount);
    setAvailableContracts(contracts);
  }, [contractFactory]);

  useEffect(() => {
    if (walletStatus === WalletStatus.Connected) refreshAvilableContracts();
    contractFactory.onMicropaymentsCreated(account, () => {
      setCreateSpinner(false);
      setCreatingContract(false);
      refreshAvilableContracts();
    });
  }, [refreshAvilableContracts, walletStatus, contractFactory, account]);
  // #endregion

  // #region Instance Selected
  const onSelectContract = (contractData: MicropaymentsData) => {
    setMicropaymentInstance(new MicropaymentsContract(web3, abi as AbiItem[], contractData.location));
    setInstanceName(contractData.name);
    setInstanceAddress(contractData.location);
  };

  useEffect(() => {
    const updateInstanceData = async () => {
      if (!micropaymentInstance) return;
      // micropaymentInstance.updateUserAccount(account);
      setInstanceBalance(await micropaymentInstance.getBalance());
      setShowDetails(true);
    };
    updateInstanceData();
  }, [micropaymentInstance, account]);
  // #endregion

  // #region Instance actions
  const depositToInstance = async () => {
    console.log('deposit');
  };

  const deleteInstance = async () => {
    await contractFactory.deleteContract(instanceAddress);
    setShowDetails(false);
    setMicropaymentInstance(undefined);
    refreshAvilableContracts();
  };
  // #endregion
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

  const onSignConfirm = () => {
    setSignOrder(true);
  };

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
        <div id="contract-details" className={showDetails ? 'show' : 'hide'}>
          <Card border="dark" bg="light">
            <Card.Header className="d-flex justify-content-between">
              <div>Contract Details</div>
              <CloseButton onClick={() => setShowDetails(false)} />
            </Card.Header>
            <Card.Body>
              <Card.Title>{instanceName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{instanceAddress}</Card.Subtitle>
              <Card.Text>Balance: {fromWei(instanceBalance)} ETH</Card.Text>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Sign a payment order</Accordion.Header>
                  <Accordion.Body>
                    <FloatingLabel label="Claimer Address" className="mb-3">
                      <FormControl name="targetAddress" placeholder="0x0..." required />
                    </FloatingLabel>
                    <InputGroup className="mb-3">
                      <FormControl name="allowedAmount" placeholder="0.0000" required />
                      <InputGroup.Text>ETH</InputGroup.Text>
                    </InputGroup>
                    <Button onClick={onSignConfirm}>Generate signature</Button>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-end">
              <OverlayTrigger placement="left" overlay={<Tooltip id="money-tooltip">Deposit funds</Tooltip>}>
                <Button className="icon-button" variant="dark" onClick={depositToInstance}>
                  <FaMoneyBillAlt />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="trash-tooltip">Destroy this contract</Tooltip>}>
                <Button className="icon-button" variant="danger" onClick={deleteInstance}>
                  <FaTrash />
                </Button>
              </OverlayTrigger>
            </Card.Footer>
          </Card>
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
        <Modal show={signOrder} onHide={() => setSignOrder(false)} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Signature details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ color: 'red' }}>
              Make sure to <b>copy all these values before closing this modal</b>. You won&apos;t be able to get them again.
            </p>
            <InputGroup className="mb-3">
              <InputGroup.Text>Allowed Address</InputGroup.Text>
              <FormControl aria-label="Adress allowed to make the claim" placeholder="0x0" disabled />
              <Button className="form-button" variant="outline-dark">
                <FaCopy />
              </Button>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Contract Address</InputGroup.Text>
              <FormControl aria-label="Contract Adress where to make the the claim" placeholder="0x0" disabled />
              <Button className="form-button" variant="outline-dark">
                <FaCopy />
              </Button>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Allowed Amount</InputGroup.Text>
              <FormControl aria-label="Allowed amount to claim in eth" placeholder="0.0000" disabled />
              <Button className="form-button" variant="outline-dark">
                <FaCopy />
              </Button>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Nonce</InputGroup.Text>
              <FormControl aria-label="Unique nonce for claim order" placeholder={Date.now().toString()} disabled />
              <Button className="form-button" variant="outline-dark">
                <FaCopy />
              </Button>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Signature</InputGroup.Text>
              <FormControl aria-label="Generated signature hash" placeholder="0x0" disabled />
              <Button className="form-button" variant="outline-dark">
                <FaCopy />
              </Button>
            </InputGroup>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Company;
