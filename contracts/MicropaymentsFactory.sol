// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Micropayments.sol";

contract MicropaymentsFactory is Ownable {
    struct MicropaymentData {
        Micropayments location;
        string name;
    }

    Micropayments[] public contracts;
    uint256 private removedCount;
    mapping(bytes32 => address) private nameToAddress;
    mapping(address => bool) private deletedContracts;

    event MicropaymentsCreated(address indexed from, address indexed location, string name, uint256 createdAt, uint256 value);
    event MicropaymentsDeleted(address indexed from, address indexed location);
    event Result(bool result);

    function createMicropayment(string memory name) external payable onlyOwner {
        bytes32 nameHash = keccak256(bytes(name));
        require(nameToAddress[nameHash] == address(0), "[Factory] Name already exists");

        Micropayments micropaymentContract = (new Micropayments){value: msg.value}(name);
        micropaymentContract.transferOwnership(_msgSender());

        nameToAddress[nameHash] = address(micropaymentContract);
        contracts.push(micropaymentContract);

        emit MicropaymentsCreated(_msgSender(), address(micropaymentContract), name, block.timestamp, msg.value);
    }

    function getMicropaymentsContracts() external view returns (MicropaymentData[] memory _contractsData) {
        _contractsData = new MicropaymentData[](contracts.length - removedCount);
        for (uint256 i = 0; i < contracts.length; i++) {
            if (!deletedContracts[address(contracts[i])]) {
                _contractsData[i].location = contracts[i];
                _contractsData[i].name = Micropayments(contracts[i]).name();
            }
        }
    }

    function getMicropaymentsContractAddress(string memory name) external view returns (address) {
        bytes32 nameHash = keccak256(bytes(name));
        return nameToAddress[nameHash];
    }

    function deleteContract(address location) external onlyOwner {
        (bool success,) = location.call(abi.encodeWithSignature("shutdown(address)", location));
        require(success, "Failed to delete contract");
        deletedContracts[location] = true;
        removedCount++;

        emit MicropaymentsDeleted(_msgSender(), location);
    }
}
