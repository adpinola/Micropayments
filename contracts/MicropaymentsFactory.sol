// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Micropayments.sol";

contract MicropaymentsFactory is Ownable {
    struct MicropaymentData {
        address location;
        string name;
    }

    Micropayments[] public contracts;
    mapping(bytes32 => address) private nameToAddress;
    mapping(address => uint256) private addressToIndex;

    event MicropaymentsCreated(address indexed from, address indexed location, string name, uint256 createdAt, uint256 value);
    event MicropaymentsDeleted(address indexed from, address indexed location);

    function createMicropayment(string memory name) external payable onlyOwner {
        bytes32 nameHash = keccak256(bytes(name));
        require(nameToAddress[nameHash] == address(0), "[Factory] Name already exists");

        Micropayments micropaymentContract = (new Micropayments){value: msg.value}(name);
        micropaymentContract.transferOwnership(_msgSender());

        addressToIndex[address(micropaymentContract)] = contracts.length;
        nameToAddress[nameHash] = address(micropaymentContract);
        contracts.push(micropaymentContract);

        emit MicropaymentsCreated(_msgSender(), address(micropaymentContract), name, block.timestamp, msg.value);
    }

    function getMicropaymentsContracts() external view returns (MicropaymentData[] memory _contracts) {
        _contracts = new MicropaymentData[](contracts.length);
        for (uint256 i = 0; i < contracts.length; i++) {
            _contracts[i].location = address(contracts[i]);
            _contracts[i].name = Micropayments(contracts[i]).name();
        }
    }

    function getMicropaymentsContractAddress(string memory name) external view returns (address) {
        bytes32 nameHash = keccak256(bytes(name));
        return nameToAddress[nameHash];
    }

    function deleteContract(address location) external onlyOwner {
        uint256 contractIndex = addressToIndex[location];
        Micropayments toDelete = Micropayments(contracts[contractIndex]);

        toDelete.shutdown();

        contracts[contractIndex] = contracts[contracts.length - 1];
        contracts.pop();

        emit MicropaymentsDeleted(_msgSender(), location);
    }
}
