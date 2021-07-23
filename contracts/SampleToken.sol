// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SampleToken {
  //set a state variable name
  string public name = "SampleToken";
  string public symbol = "SMLT";
  string public standard = "Sample Token v1.0";

  event Transfer(address indexed from, address indexed to, uint256 value);

  // set the total supply of tokens to 1,000,000
  uint public totalSupply;

  //key is the address of the account that has the token balance
  //uint256 is the amount of tokens owned by the address
  mapping (address => uint256) public balanceOf;

  constructor(uint256 _initialSupply) public {
    totalSupply = _initialSupply;

    //initialize the balance of the account that has the token balance
    balanceOf[msg.sender] = _initialSupply;
  }

  //function to transfer tokens to another account
  function transfer(address _to, uint256 _value) public returns(bool success){
    require(balanceOf[msg.sender] >= _value);
    balanceOf[_to] += _value;
    balanceOf[msg.sender] -= _value;

    emit Transfer(msg.sender, _to, _value);

    return true;
  }
}
