/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState } from 'react';
import { Button, Card, Modal, CloseButton, Tooltip, OverlayTrigger, FloatingLabel, FormControl, InputGroup, Accordion } from 'react-bootstrap';
import { FaCopy, FaMoneyBillAlt, FaRegPlusSquare, FaTrash } from 'react-icons/fa';
import '../styles/Company.scss';
import ContractsTable from './ContractsTable';
import MetaMaskIcon from './MetaMaskIcon';

enum WalletStatus {
  Locked = 'Locked',
  Connected = 'Connected',
}

const dummyContractData = [
  { address: '0xbeac3cf3167abd', name: 'Contract A' },
  { address: '0xbea121c3cfdd3d', name: 'Contract B' },
  { address: '0xbeacd126873cfd', name: 'Contract C' },
];

const Company: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [balance, setBalance] = useState<number>(0);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(WalletStatus.Locked);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [creatingContract, setCreatingContract] = useState(false);
  const [signOrder, setSignOrder] = useState(false);

  const connectWallet = () => {
    setWalletStatus(WalletStatus.Connected);
  };

  const onSelectContract = (address: string) => {
    console.log('selected contract: ', address);
    setShowDetails(true);
  };

  const onCreateContract = () => {
    setCreatingContract(true);
  };

  const onConfirmCreate = () => {
    setCreatingContract(false);
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
          <ContractsTable contractData={dummyContractData} rowSelectedCallback={onSelectContract} />
        </div>
        <div id="contract-details" className={showDetails ? 'show' : 'hide'}>
          <Card border="dark" bg="light">
            <Card.Header className="d-flex justify-content-between">
              <div>Contract Details</div>
              <CloseButton onClick={() => setShowDetails(false)} />
            </Card.Header>
            <Card.Body>
              <Card.Title> Contract A</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">0xbeac3cf3167abd</Card.Subtitle>
              <Card.Text>Balance: {balance} ETH</Card.Text>
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
                <Button className="icon-button" variant="dark">
                  <FaMoneyBillAlt />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="trash-tooltip">Destroy this contract</Tooltip>}>
                <Button className="icon-button" variant="danger">
                  <FaTrash />
                </Button>
              </OverlayTrigger>
            </Card.Footer>
          </Card>
        </div>
        <Modal show={walletStatus === WalletStatus.Locked} centered>
          <Modal.Body>Please, connnect your wallet to continue.</Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="primary" onClick={connectWallet} className="d-flex">
              <MetaMaskIcon />
              <div>Connect with MetaMask</div>
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={creatingContract} onHide={() => setCreatingContract(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>New Contract</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel label="Contract Name" className="mb-3">
              <FormControl name="name" placeholder="choose a name..." required />
            </FloatingLabel>
            <InputGroup className="mb-3">
              <FormControl name="amount" placeholder="0.0000" required />
              <InputGroup.Text>ETH</InputGroup.Text>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onConfirmCreate}>Confirm</Button>
          </Modal.Footer>
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
