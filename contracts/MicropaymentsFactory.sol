// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Micropayments.sol";

contract MicropaymentsFactory is Ownable {
    Micropayments[] public contracts;
    mapping(bytes32 => address) private nameToAddress;

    event MicropaymentsCreated(address indexed from, address indexed location, string name, uint256 createdAt, uint256 value);

    function createMicropayment(string memory name) external payable onlyOwner {
        bytes32 nameHash = keccak256(bytes(name));
        require(nameToAddress[nameHash] == address(0), "[Factory] Name already exists");

        Micropayments micropaymentContract = (new Micropayments){value: msg.value}(name);
        micropaymentContract.transferOwnership(_msgSender());

        nameToAddress[nameHash] = address(micropaymentContract);
        contracts.push(micropaymentContract);

        emit MicropaymentsCreated(_msgSender(), address(micropaymentContract), name, block.timestamp, msg.value);
    }

    function getMicropaymentsContracts() external view returns (Micropayments[] memory _contracts) {
        _contracts = new Micropayments[](contracts.length);
        for (uint256 i = 0; i < contracts.length; i++) {
            _contracts[i] = contracts[i];
        }
    }

    function getMicropaymentsContractAddress(string memory name) external view returns (address) {
        bytes32 nameHash = keccak256(bytes(name));
        return nameToAddress[nameHash];
    }
}
