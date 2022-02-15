import React, { FC, useState } from 'react';
import { Button, Col, Container, Row, Card, Modal, FormControl, InputGroup, FloatingLabel } from 'react-bootstrap';
import '../styles/Contractor.scss';
import MetaMaskIcon from './MetaMaskIcon';

enum WalletStatus {
  Locked = 'Locked',
  Connected = 'Connected',
}

const Contractor: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [balance, setBalance] = useState<number>(0);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(WalletStatus.Locked);
  const [showModal, setShowModal] = useState(false);
  const [claimValues, setClaimValues] = useState({});

  const claimPayment = () => {
    console.log(claimValues);
    setShowModal(false);
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setClaimValues((values) => ({ ...values, [name]: value }));
    // ToDo: Perform field validations
  };

  const connectWallet = () => {
    setWalletStatus(WalletStatus.Connected);
  };

  return (
    <div id="contractor">
      <Container className="content">
        <Row>
          <Col>
            <Card className="text-center" border="dark" bg="light">
              <Card.Header>Your account&apos;s balance</Card.Header>
              <Card.Title as="h1">{balance} ETH</Card.Title>
              <Card.Body className="d-flex justify-content-center">
                {walletStatus === WalletStatus.Connected ? (
                  <Button variant="secondary" onClick={() => setShowModal(true)}>
                    Claim a payment
                  </Button>
                ) : (
                  <Button variant="secondary" className="d-flex" onClick={connectWallet}>
                    <MetaMaskIcon />
                    <div>Connect to MetaMask</div>
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)} className="contractor-modal">
        <Modal.Header closeButton>
          <Modal.Title>Claim your payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Contract Address" className="mb-3">
            <FormControl name="address" placeholder="0x..." onChange={handleChange} required />
          </FloatingLabel>
          <InputGroup className="mb-3">
            <FormControl name="amount" placeholder="0.0000" onChange={handleChange} />
            <InputGroup.Text>ETH</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl name="nonce" placeholder={Date.now().toString()} onChange={handleChange} />
          </InputGroup>
          <FloatingLabel label="Signature" className="mb-3">
            <FormControl
              style={{ minHeight: '150px', maxHeight: '250px' }}
              as="textarea"
              name="signature"
              placeholder="0x..."
              onChange={handleChange}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={claimPayment}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Contractor;
