// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Candy721Ownable is ERC721, Ownable {
    //    struct Trait {
    //        string display_type;
    //        string trait_type;
    //        string trait_value;
    //    }
    //    tokenTrait[tokenId] = Trait(display_type, trait_type, trait_value);

    uint256 public maxSupply;

    uint256 public singlePrice;

    uint256 public tokenCount;

    mapping(uint256 => string) public tokenImage;

    mapping(uint256 => string) public tokenTrait;

    mapping(uint256 => string) public tokenSignature;

    mapping(string => address) public signatureOwner;

    constructor(uint256 max_supply, uint256 single_price, string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {
        maxSupply = max_supply;
        singlePrice = single_price;
    }

    function mint(address to, string calldata signature, string calldata image) public payable returns (uint256) {
        uint256 diff = msg.value - singlePrice; // require(msg.value >= singlePrice, "Value is not enough");
        if (diff > 0) {
            (bool success,) = payable(msg.sender).call{value: diff}("");
            require(success, "Unable to send value");
        }

        uint256 tokenId = tokenCount++;
        // _mint requires to != address(0)
        _mint(to, tokenId);
        tokenImage[tokenId] = image;
        tokenSignature[tokenId] = signature;
        signatureOwner[signature] = to;
        return tokenId;
    }

    // traits = "[ {display_type, trait_type, value}, {display_type, trait_type, value}, ... ]"
    function mint(address to, string calldata signature, string calldata image, string calldata traits)
        public
        payable
    {
        uint256 tokenId = mint(to, signature, image);
        tokenTrait[tokenId] = traits;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        return constructJsonURI(tokenId);
    }

    // https://docs.opensea.io/docs/metadata-standards
    function constructJsonURI(uint256 tokenId) internal view returns (string memory) {
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    abi.encodePacked(
                        "{",
                        '"name":"CandySea NFT",',
                        '"description":"CandySea is great.",',
                        '"image":"',
                        tokenImage[tokenId],
                        '",',
                        '"attributes":"',
                        tokenTrait[tokenId],
                        '",',
                        "}"
                    )
                )
            )
        );
    }
}
