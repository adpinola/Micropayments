import React, { FC } from 'react';
import { Table } from 'react-bootstrap';
import { MicropaymentsData } from '../services/ethereum/MicropaymentsDataType';
import '../styles/ContractsTable.scss';

interface IContractsTable {
  contractData: Array<MicropaymentsData>;
  rowSelectedCallback: (contractData: MicropaymentsData) => Promise<void> | void;
}

const ContractsTable: FC<IContractsTable> = (props: IContractsTable) => {
  return (
    <div id="contracts-table">
      <Table striped hover size="sm" variant="primary">
        <thead>
          <tr>
            <th>#</th>
            <th>Address</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {props.contractData.map((contract, index) => (
            <tr key={contract.location} onClick={() => props.rowSelectedCallback(contract)}>
              <td>{index}</td>
              <td>{contract.location}</td>
              <td>{contract.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ContractsTable;
