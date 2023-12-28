// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./IInterface.sol";

contract Candy721OwnableSynthetic is ERC721Enumerable, Ownable {
    //    struct Trait {
    //        string display_type;
    //        string trait_type;
    //        string trait_value;
    //    }
    //    tokenTrait[tokenId] = Trait(display_type, trait_type, trait_value);

    string public description;

    uint256 public stop;

    address public factory;

    uint256 public maxSupply;

    uint256 public singlePrice;

    mapping(uint256 => string) public tokenImage;

    mapping(uint256 => string) public tokenTrait;

    mapping(uint256 => string) public tokenSignature;

    mapping(string => address) public signatureOwner;

    constructor(
        uint256 max_supply,
        uint256 single_price,
        string memory name_,
        string memory symbol_,
        string memory description_
    ) ERC721(name_, symbol_) {
        description = description_;
        factory = msg.sender;
        maxSupply = max_supply;
        singlePrice = single_price;
    }

    // traits = "[ {display_type, trait_type, value}, {display_type, trait_type, value}, ... ]"
    function mint(address to, string calldata signature, string calldata image, string calldata traits)
        public
        payable
    {
        bool success;
        uint256 mint_fee = IMintFee(factory).fee();
        // it requires msg.value >= singlePrice + 0.1 ether
        uint256 diff = msg.value - (singlePrice + mint_fee);
        if (diff > 0) {
            (success,) = payable(msg.sender).call{value: diff}("");
            require(success, "Unable to send value");
        }

        (success,) = payable(factory).call{value: mint_fee}("");
        require(success, "Unable to send value");

        uint256 tokenId = totalSupply() + 1;
        require(stop == 0 || tokenId <= stop, "Stopped");
        require(maxSupply == 0 || tokenId <= maxSupply, "Over MAX");

        // it requires to != address(0)
        _mint(to, tokenId);

        tokenImage[tokenId] = image;
        tokenSignature[tokenId] = signature;
        signatureOwner[signature] = to;

        tokenTrait[tokenId] = traits;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        return constructJsonURI(tokenId);
    }

    // https://docs.opensea.io/docs/metadata-standards
    function constructJsonURI(uint256 tokenId) public view returns (string memory) {
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    abi.encodePacked(
                        "{",
                        '"name":"',
                        name(),
                        '",',
                        '"description":"',
                        description,
                        '",',
                        '"image":"',
                        tokenImage[tokenId],
                        '",',
                        '"attributes":',
                        tokenTrait[tokenId],
                        "}"
                    )
                )
            )
        );
    }

    function start(uint256 _stop) external onlyOwner {
        require(_stop > totalSupply() && _stop <= maxSupply, "Range error");
        stop = _stop;
    }

    function withdraw(address recipient, uint256 amount) external onlyOwner {
        require(recipient != address(0), "Zero address");
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success,) = payable(recipient).call{value: amount}("");
        require(success, "Unable to send value");
    }
}
