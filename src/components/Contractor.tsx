import React, { FC, useState } from 'react';
import { Button, Col, Container, Row, Card, Modal, FormControl, InputGroup, FloatingLabel } from 'react-bootstrap';
import '../styles/Contractor.scss';

const Contractor: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [balance, setBalance] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  return (
    <div id="contractor">
      <Container className="content">
        <Row>
          <Col>
            <Card className="text-center" border="dark" bg="light">
              <Card.Header>Your account&apos;s balance</Card.Header>
              <Card.Title as="h1">{balance} ETH</Card.Title>
              <Card.Body>
                <Button variant="secondary" onClick={() => setShowModal(true)}>
                  Claim
                </Button>
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
            <FormControl aria-label="target contract address" placeholder="0x..." />
          </FloatingLabel>
          <InputGroup className="mb-3">
            <FormControl aria-label="ETH amount to claim" placeholder="0.0000" />
            <InputGroup.Text>ETH</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl aria-label="nonce" placeholder={Date.now().toString()} />
          </InputGroup>
          <FloatingLabel label="Signature" className="mb-3">
            <FormControl style={{ minHeight: '150px', maxHeight: '250px' }} as="textarea" aria-label="signature" placeholder="0x..." />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Contractor;
