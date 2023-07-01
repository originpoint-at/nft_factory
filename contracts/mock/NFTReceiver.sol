// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface TransferFrom {
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

contract NFTReceiver {
    event Received(address operator, address from, uint256 tokenId, bytes data);

    function safeTransferFromWithData(address token, address from, address to, uint256 tokenId, bytes calldata data)
        public
    {
        TransferFrom(token).safeTransferFrom(from, to, tokenId, data);
    }

    function safeTransferFrom(address token, address from, address to, uint256 tokenId) public {
        TransferFrom(token).safeTransferFrom(from, to, tokenId);
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)
        external
        returns (bytes4)
    {
        emit Received(operator, from, tokenId, data);
        return IERC721Receiver.onERC721Received.selector;
    }
}
