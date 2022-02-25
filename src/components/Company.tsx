/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState } from 'react';
import { Button, Col, Container, Row, Card, Modal, FormControl, InputGroup, FloatingLabel } from 'react-bootstrap';
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
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(WalletStatus.Connected);
  const [showModal, setShowModal] = useState(false);
  const [claimValues, setClaimValues] = useState({});
  const [showDetails, setShowDetails] = useState(false);

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

  const onSelectContract = (address: string) => {
    console.log('selected contract: ', address);
    setShowDetails(!showDetails);
  };

  return (
    <div id="company">
      <div className="content">
        {walletStatus === WalletStatus.Locked ? (
          <Card className="text-center" border="dark" bg="light">
            <Card.Header>Your account&apos;s balance</Card.Header>
            <Card.Title as="h1">{balance} ETH</Card.Title>
            <Card.Body className="d-flex justify-content-center">
              <Button variant="secondary" className="d-flex" onClick={connectWallet}>
                <MetaMaskIcon />
                <div>Connect to MetaMask</div>
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
            <ContractsTable contractData={dummyContractData} rowSelectedCallback={onSelectContract} />
            <div id="contract-details" className={showDetails ? 'show' : 'hide'}>
              <Card className="text-center" border="dark" bg="light">
                <Card.Header>Your account&apos;s balance</Card.Header>
                <Card.Title as="h1">{balance} ETH</Card.Title>
                <Card.Body className="d-flex justify-content-center" />
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Company;
