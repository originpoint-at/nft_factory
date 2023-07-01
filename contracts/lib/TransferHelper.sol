// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

library TransferHelper {
    function sendValue(address recipient, uint256 amount) internal {
        address payable payableRecipient = payable(recipient);

        require(address(this).balance >= amount, "Insufficient balance");

        (bool success,) = payableRecipient.call{value: amount}("");
        require(success, "Unable to send value");
    }
}
