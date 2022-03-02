import React, { FC } from 'react';
import { Button, Modal, FormControl, InputGroup } from 'react-bootstrap';
import { FaCopy } from 'react-icons/fa';

import '../styles/Company.scss';
import { ClaimInfo } from '../assets/formData/ClaimInfo';

interface ISignatureDetailsModal {
  claimInfo: ClaimInfo;
  show: boolean;
  onClose: () => void;
}

const SignatureDetailsModal: FC<ISignatureDetailsModal> = (props: ISignatureDetailsModal) => (
  <Modal show={props.show} onHide={props.onClose} centered backdrop="static">
    <Modal.Header closeButton>
      <Modal.Title>Signature details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p style={{ color: 'red' }}>
        Make sure to <b>copy all these values before closing this modal</b>. You won&apos;t be able to get them again.
      </p>
      <InputGroup className="mb-3">
        <InputGroup.Text>Allowed Address</InputGroup.Text>
        <FormControl aria-label="Adress allowed to make the claim" placeholder="0x0" disabled value={props.claimInfo.claimerAddress} />
        <Button className="form-button" variant="outline-dark">
          <FaCopy />
        </Button>
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Contract Address</InputGroup.Text>
        <FormControl aria-label="Contract Adress where to make the the claim" placeholder="0x0" disabled value={props.claimInfo.contractAddress} />
        <Button className="form-button" variant="outline-dark">
          <FaCopy />
        </Button>
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Allowed Amount</InputGroup.Text>
        <FormControl aria-label="Allowed amount to claim in eth" placeholder="0.0000" disabled value={props.claimInfo.amount} />
        <Button className="form-button" variant="outline-dark">
          <FaCopy />
        </Button>
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Nonce</InputGroup.Text>
        <FormControl aria-label="Unique nonce for claim order" placeholder="0" disabled value={props.claimInfo.nonce} />
        <Button className="form-button" variant="outline-dark">
          <FaCopy />
        </Button>
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Signature</InputGroup.Text>
        <FormControl aria-label="Generated signature hash" placeholder="0x0" disabled value={props.claimInfo.signature} />
        <Button className="form-button" variant="outline-dark">
          <FaCopy />
        </Button>
      </InputGroup>
    </Modal.Body>
  </Modal>
);

export default SignatureDetailsModal;
