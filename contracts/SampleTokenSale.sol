// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./SampleToken.sol";

contract SampleTokenSale {
  address admin;
  SampleToken public tokenContract;
  uint256 public tokenPrice;

  constructor(SampleToken _tokenContract, uint256 _tokenPrice) public {
    // Assign the token sale manager address to the contract
    // Assign the token contract address to the contract
    // Assign the token price to the contract
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }
}
