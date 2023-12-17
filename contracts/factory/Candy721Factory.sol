// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Candy721Ownable.sol";

contract Candy721Factory is Ownable {
    // 保存所有已经创建的NFT合约地址
    address[] public contracts;
    address[] public creators;
    uint256 public fee = 0.1 ether; // 0.1 matic

    // 事件，用于通知新合约的创建
    event ContractCreated(
        address indexed nftContract,
        address indexed owner,
        string name,
        string symbol,
        uint256 max_supply,
        uint256 single_price
    );

    receive() external payable {

    }

    // 创建一个新的NFT合约
    function createContract(
        string memory name,
        string memory symbol,
        string memory description,
        uint256 max_supply,
        uint256 single_price
    ) external {
        Candy721Ownable nft = new Candy721Ownable(max_supply, single_price, name, symbol, description);
        contracts.push(address(nft));
        creators.push(msg.sender);
        nft.transferOwnership(msg.sender);

        emit ContractCreated(address(nft), msg.sender, name, symbol, max_supply, single_price);
    }

    // 获取已创建的NFT合约数量
    function contractAmount() external view returns (uint256) {
        return contracts.length;
    }

    function withdraw(address recipient, uint256 amount) external onlyOwner {
        require(recipient != address(0), "Zero address");
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success,) = payable(recipient).call{value: amount}("");
        require(success, "Unable to send value");
    }

    function setMintFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }
}
