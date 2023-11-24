// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Candy721Ownable.sol";

contract Candy721Factory {
    // 保存所有已经创建的NFT合约地址
    address[] public contracts;
    address[] public creators;

    // 事件，用于通知新合约的创建
    event ContractCreated(address indexed nftContract, address indexed owner);

    // 创建一个新的NFT合约
    function createContract(string memory name, string memory symbol, uint256 max_supply, uint256 single_price)
        external
    {
        Candy721Ownable nft = new Candy721Ownable(max_supply, single_price, name, symbol);
        contracts.push(address(nft));
        creators.push(msg.sender);
        nft.transferOwnership(msg.sender);

        emit ContractCreated(address(nft), msg.sender);
    }

    // 获取已创建的NFT合约数量
    function contractAmount() external view returns (uint256) {
        return contracts.length;
    }
}
