// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Ownable is ERC721, Ownable {

    uint256 public tokenCount;

    mapping(uint256 => string) private tokenImage;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {

    }

    function mint(address to, string calldata image) public virtual {
        uint256 tokenId = tokenCount++;
        _mint(to, tokenId);
        tokenImage[tokenId] = image;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        return tokenImage[tokenId];
    }
}



