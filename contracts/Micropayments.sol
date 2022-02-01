// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "./SignUtils.sol";

contract ReceiverPays {
    using SignUtils for bytes32;
    address public owner;
    mapping(uint256 => bool) private usedNonces;

    constructor() payable {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    function claimPayment(
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    ) external {
        require(!usedNonces[nonce], "Claim already done");
        usedNonces[nonce] = true;
        bytes32 message = keccak256(abi.encodePacked(msg.sender, amount, nonce, this)).prefixed();
        require(message.recoverSigner(signature) == owner, "Signature is invalid [owner]");
        payable(msg.sender).transfer(amount);
    }

    function shutdown() external onlyOwner {
        selfdestruct(payable(owner));
    }
}
