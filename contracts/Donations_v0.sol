pragma solidity ^0.4.24;

import "openzeppelin-zos/contracts/ownership/Ownable.sol";
import "openzeppelin-zos/contracts/math/SafeMath.sol";
import "openzeppelin-zos/contracts/token/ERC721/MintableERC721Token.sol";

contract Donations_v0 is Ownable {
    using SafeMath for uint256;

    // stores how much ether has anyone donated
    mapping (address => uint256) public donorBalances;
    // ERC721 non-fungible token to be rewarded for each donation
    MintableERC721Token public token;
    // total number of ERC721 tokens minted so far; used as tokenId when minting a new token
    uint256 public numTokensMinted;

    function donate() public payable {
        require(msg.value > 0);
        donorBalances[msg.sender] = donorBalances[msg.sender].add(msg.value);
        token.mint(msg.sender, numTokensMinted);
        numTokensMinted = numTokensMinted.add(1);
    }

    // Set the address for the ERC721 token; can only be set once
    function setToken(MintableERC721Token _token) public onlyOwner {
        require(_token != address(0));
        require(token == address(0));
        token = _token;
    }

    function getDonorBalance(address _donor) public view returns (uint256) {
        return donorBalances[_donor];
    }
}