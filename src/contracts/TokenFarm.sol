pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    
    // 1) Stake Token (deposit)
    // Take dapp tokens, send to tokenFarm
    function stakeTokens(uint _amount) public {
        require(_amount > 0, "Amount cannot be 0");
        // Transfer Mock Dai Tokens to this contract's address for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);
        // Update staking balance
        stakingBalance[msg.sender] += _amount;

        // Add user to stakers array *only* if they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        // update staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // Unstaking Tokens (withdraw)
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "Balance cannot be 0");

        // Transfer mock dai tokens from this contract back to the user to unstake
        daiToken.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;

    }

    // Issuing Tokens to all stakers
    // for every person who is staked in the app, fetch the balance, and send the same amount in dai tokens
    function issueTokens() public {
        require(msg.sender == owner, "caller must be the owner");
        for (uint i=0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            dappToken.transfer(recipient, balance);
        }
    }

}
