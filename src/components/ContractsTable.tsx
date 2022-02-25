import React, { FC } from 'react';
import { Table } from 'react-bootstrap';
import '../styles/ContractsTable.scss';

type ContractData = {
  address: string;
  name: string;
};

interface IContractsTable {
  contractData: Array<ContractData>;
  rowSelectedCallback: (address: string) => Promise<void> | void;
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
            <tr onClick={() => props.rowSelectedCallback(contract.address)}>
              <td>{index}</td>
              <td>{contract.address}</td>
              <td>{contract.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ContractsTable;
