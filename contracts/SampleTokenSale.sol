// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./SampleToken.sol";

contract SampleTokenSale {
  address admin;
  SampleToken public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokenSold;

  event Sell(address _buyer, uint256 _amount);

  // Assign the token sale manager address to the contract
  // Assign the token contract address to the contract
  // Assign the token price to the contract
  constructor(SampleToken _tokenContract, uint256 _tokenPrice) public {
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }

  //the payable is there because we want someone to be able to send ether when this function is called
  function buyTokens(uint256 _numberOfTokens) public payable {
    require(msg.value == multiply(tokenPrice, _numberOfTokens));
    require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
    require(tokenContract.transfer(msg.sender, _numberOfTokens));// this is the actual buy functionality

    //keep track of the token sold
    tokenSold += _numberOfTokens;
    //Trigger the sell event
    emit Sell(msg.sender, _numberOfTokens);
  }

  //Ending Token sale
  function endSale() public {
    //Verify that only admin can do this
    require(msg.sender == admin);
    //Transfer the remaining token to the admin
    require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
    //Destroy the contract
    //address payable adminPayable = payable(address(admin));
    //selfdestruct(theadmin);
  }

  function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
  }
}
