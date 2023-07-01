// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract InterfaceValidator {
    function isSupport(address erc165) public view returns (bool) {
        return IERC165(erc165).supportsInterface(type(IERC721).interfaceId)
            && IERC165(erc165).supportsInterface(type(IERC165).interfaceId)
            && IERC165(erc165).supportsInterface(type(IERC721Metadata).interfaceId)
            && IERC165(erc165).supportsInterface(type(IERC721Enumerable).interfaceId);
    }
}
