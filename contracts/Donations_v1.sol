pragma solidity ^0.4.24;

import "openzeppelin-zos/contracts/math/SafeMath.sol";
import "./Donations_v0.sol";

/**
  upgrade Donations contract with the "withdraw" feature; donors can withdraw the donations
  made in the current stage; a stage is defined as the interval between 2 withdrawals
  from the owner account
*/
contract Donations_v1 is Donations_v0 {
    using SafeMath for uint256;
    
    // current stage number
    uint256 public stage;
    // donor balances by stage
    mapping (uint256 => mapping (address => uint256)) public donationsByStage;

    function donate() public payable {
        super.donate();
        donationsByStage[stage][msg.sender] = donationsByStage[stage][msg.sender].add(msg.value);
    }

    function withdrawDonation(uint256 _amount) public {
        require(_amount <= donationsByStage[stage][msg.sender]);
        assert(_amount <= address(this).balance);
        donorBalances[msg.sender] = donorBalances[msg.sender].sub(_amount);
        donationsByStage[stage][msg.sender] = donationsByStage[stage][msg.sender].sub(_amount);
        msg.sender.transfer(_amount);        
    }

    function withdraw(address _target) public onlyOwner {
        stage = stage.add(1);
        _target.transfer(address(this).balance);
    }

    function getDonorBalanceByStage(address _donor, uint256 _stage) public view returns (uint256) {
        return donationsByStage[_stage][_donor];
    }
}