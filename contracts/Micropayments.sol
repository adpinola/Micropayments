// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SignUtils.sol";

contract Micropayments is Ownable {
    using SignUtils for bytes32;
    using SignUtils for bytes;
    mapping(uint256 => bool) private usedNonces;
    string public name;

    event PaymentClaimed(address indexed from, string name, uint256 at);

    constructor(string memory _name) payable {
        name = _name;
    }

    function claimPayment(
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    ) external {
        require(!usedNonces[nonce], "Claim already done");
        usedNonces[nonce] = true;
        bytes32 message = keccak256(abi.encodePacked(_msgSender(), amount, nonce, this)).prefixed();
        require(message.recoverSigner(signature) == owner(), "Signature is invalid [owner]");
        payable(_msgSender()).transfer(amount);
        emit PaymentClaimed(_msgSender(), name, block.timestamp);
    }

    function getBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function shutdown() external onlyOwner {
        selfdestruct(payable(owner()));
    }
}
