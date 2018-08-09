pragma solidity ^0.4.24;

import "openzeppelin-zos/contracts/math/SafeMath.sol";
import "./Donations_v1.sol";

/**
  Add events to Donations contract
*/
contract Donations_v2 is Donations_v1 {
    using SafeMath for uint256;

    event NewDonation(
        address indexed donor,
        uint256 value,
        uint256 indexed stage,
        uint256 indexed tokenId
    );
    event DonationWithdrawn(address indexed donor, uint256 amount);
    event BalanceWithdrawn(address indexed target, uint256 indexed endedStage, uint256 amount);

    function donate() public payable {
        super.donate();
        emit NewDonation(msg.sender, msg.value, stage, numTokensMinted.sub(1));
    }

    function withdrawDonation(uint256 _amount) public {
        super.withdrawDonation(_amount);
        emit DonationWithdrawn(msg.sender, _amount);
    }

    function withdraw(address _target) public onlyOwner {
        uint256 balance = address(this).balance;
        super.withdraw(_target);
        emit BalanceWithdrawn(_target, stage.sub(1), balance);
    }
}