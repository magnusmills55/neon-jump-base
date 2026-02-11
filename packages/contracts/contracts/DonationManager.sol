// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationManager is Ownable {
    event DonationReceived(address indexed donor, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function donate() external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        emit DonationReceived(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Function to check contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
