import React, { FC, useState, useEffect } from 'react';
import { Button, Card, CloseButton, Tooltip, OverlayTrigger, FloatingLabel, FormControl, InputGroup, Accordion, Form } from 'react-bootstrap';
import { FaMoneyBillAlt, FaTrash } from 'react-icons/fa';
import { fromWei, AbiItem, toWei } from 'web3-utils';
import { useAccount } from '../context/SmartContractContext';
import useWeb3 from '../hooks/useWeb3';
import { MicropaymentsData } from '../services/ethereum/MicropaymentsDataType';
import '../styles/ContractDetails.scss';
import { abi } from '../assets/Micropayments.json';
import IMicropaymentsContract from '../services/ethereum/IMicropaymentsContract';
import MicropaymentsContract from '../services/ethereum/MicropaymentsContract';
import { GenerateSignatureInputData } from '../assets/formData/GenerateSignatureInputData';
import OffChainValidator from '../services/payments/OffChainValidator';
import { ClaimInfo } from '../assets/formData/ClaimInfo';

interface IContractDetails {
  closeCallback: () => Promise<void> | void;
  onSignConfirm: (claimInfo: ClaimInfo) => Promise<void> | void;
  onDeposit: () => Promise<void> | void;
  onDelete: (address: string) => Promise<void> | void;
  data: MicropaymentsData;
}

const ContractDetails: FC<IContractDetails> = (props: IContractDetails) => {
  const account = useAccount();
  const { web3 } = useWeb3();
  const [micropaymentInstance, setMicropaymentInstance] = useState<IMicropaymentsContract>();
  const [balance, setBalance] = useState<string>('');

  useEffect(() => {
    const updateInstanceData = async () => {
      if (!micropaymentInstance) return;
      setBalance(await micropaymentInstance.getBalance());
    };

    updateInstanceData();
  }, [micropaymentInstance]);

  useEffect(() => {
    if (!web3) return;
    if (!account) return;
    if (!props.data.location) return;
    setMicropaymentInstance(new MicropaymentsContract(web3, abi as AbiItem[], props.data.location, account));
  }, [props.data, web3, account]);

  const onSign = async (event: any) => {
    try {
      const instanceAddress = props.data.location;
      event.preventDefault();
      const { targetAddress, allowedAmount } = Object.fromEntries(new FormData(event.target)) as unknown as GenerateSignatureInputData;
      const offChainValidator = new OffChainValidator(web3, instanceAddress);
      const nonce = Date.now();
      const signature = await offChainValidator.signTransaction(targetAddress, toWei(allowedAmount), nonce, account);
      props.onSignConfirm({
        amount: allowedAmount,
        claimerAddress: targetAddress,
        nonce,
        signature,
        contractAddress: instanceAddress,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Card id="contract-details" border="dark" bg="light">
      <Card.Header className="d-flex justify-content-between">
        <div>Contract Details</div>
        <CloseButton onClick={props.closeCallback} />
      </Card.Header>
      <Card.Body>
        <Card.Title>{props.data?.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{props.data?.location}</Card.Subtitle>
        <Card.Text>Balance: {fromWei(balance)} ETH</Card.Text>
        <Accordion defaultActiveKey="0">
          <Form onSubmit={onSign}>
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
                <Button type="submit">Generate signature</Button>
              </Accordion.Body>
            </Accordion.Item>
          </Form>
        </Accordion>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <OverlayTrigger placement="left" overlay={<Tooltip id="money-tooltip">Deposit funds</Tooltip>}>
          <Button className="icon-button" variant="dark" onClick={props.onDeposit}>
            <FaMoneyBillAlt />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip id="trash-tooltip">Destroy this contract</Tooltip>}>
          <Button className="icon-button" variant="danger" onClick={() => props.onDelete(props.data?.location as string)}>
            <FaTrash />
          </Button>
        </OverlayTrigger>
      </Card.Footer>
    </Card>
  );
};

export default ContractDetails;
