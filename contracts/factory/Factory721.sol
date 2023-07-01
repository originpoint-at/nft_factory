// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTFactory is Ownable {
    // 保存所有已经创建的NFT合约地址
    address[] public nftContracts;

    // 事件，用于通知新合约的创建
    event NFTContractCreated(address indexed nftContract, address indexed owner);

    // 创建一个新的NFT合约
    function createNFTContract(string memory name, string memory symbol) external onlyOwner {
        ERC721 nftContract = new ERC721(name, symbol);
        nftContracts.push(address(nftContract));

        emit NFTContractCreated(address(nftContract), owner());
    }

    // 获取已创建的NFT合约数量
    function getNFTContractCount() external view returns (uint256) {
        return nftContracts.length;
    }
}
