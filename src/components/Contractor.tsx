import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Card, Modal, FormControl, InputGroup, FloatingLabel, Form } from 'react-bootstrap';
import { AbiItem, fromWei, toWei } from 'web3-utils';
import { useMetaMask, useAccount } from '../context/SmartContractContext';
import useWeb3 from '../hooks/useWeb3';
import '../styles/Contractor.scss';
import MetaMaskIcon from './MetaMaskIcon';
import { ClaimInfo } from '../assets/formData/ClaimInfo';
import MicropaymentsContract from '../services/ethereum/MicropaymentsContract';
import { abi } from '../assets/Micropayments.json';

enum WalletStatus {
  Locked = 'Locked',
  Connected = 'Connected',
}

const Contractor: FC = () => {
  const [balance, setBalance] = useState<string>('0');
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(WalletStatus.Locked);
  const [showModal, setShowModal] = useState(false);
  const connect = useMetaMask();
  const account = useAccount();
  const { web3 } = useWeb3();

  // #region Account Change
  useEffect(() => {
    const onAccountChange = async () => {
      if (!account) {
        setWalletStatus(WalletStatus.Locked);
        return;
      }
      setWalletStatus(WalletStatus.Connected);
    };

    onAccountChange();
  }, [account]);
  // #endregion

  const updateBalance = useCallback(async () => {
    const accountBalance = await web3.eth.getBalance(account);
    setBalance(fromWei(accountBalance));
  }, [account, web3]);

  useEffect(() => {
    if (walletStatus !== WalletStatus.Connected) return;
    updateBalance();
  }, [walletStatus, updateBalance]);

  const claimPayment = async (event: any) => {
    try {
      const claimSuccessCallback = () => {
        updateBalance();
        setShowModal(false);
        micropaymentsContract.offPaymentClaimed(account, claimSuccessCallback);
      };

      event.preventDefault();
      const { contractAddress, amount, nonce, signature } = Object.fromEntries(new FormData(event.target)) as unknown as ClaimInfo;
      const micropaymentsContract = new MicropaymentsContract(web3, abi as AbiItem[], contractAddress, account);
      micropaymentsContract.onPaymentClaimed(account, claimSuccessCallback);
      await micropaymentsContract.claimPayment(toWei(amount), nonce, signature);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div id="contractor">
      <Container className="content">
        <Row>
          <Col>
            <Card className="text-center" border="dark" bg="light">
              <Card.Header>Your account&apos;s balance</Card.Header>
              <Card.Title as="h1">{balance} ETH</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{account}</Card.Subtitle>
              <Card.Body className="d-flex justify-content-center">
                {walletStatus === WalletStatus.Connected ? (
                  <Button variant="secondary" onClick={() => setShowModal(true)}>
                    Claim a payment
                  </Button>
                ) : (
                  <Button variant="secondary" className="d-flex" onClick={connect}>
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
        <Form onSubmit={claimPayment}>
          <Modal.Header closeButton>
            <Modal.Title>Claim your payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel label="Contract Address" className="mb-3">
              <FormControl name="contractAddress" placeholder="0x..." required />
            </FloatingLabel>
            <InputGroup className="mb-3">
              <FormControl name="amount" placeholder="0.0000" />
              <InputGroup.Text>ETH</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl name="nonce" placeholder="0" />
            </InputGroup>
            <FloatingLabel label="Signature" className="mb-3">
              <FormControl style={{ minHeight: '150px', maxHeight: '250px' }} as="textarea" name="signature" placeholder="0x..." />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Confirm</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Contractor;
