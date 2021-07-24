# sample-token
This is a complete ERC20 token implementation

It has complete ERC20 implementation.
transfer(address _to, uint256 _value): With this, the sender transfer a given value (_value) of token to the provided address (_to address)
and return true if succeeded. It emits Transfer event once transfered

approve(address _spender, uint256 _value): This allows and exchange to transfer tokens to another account on behalf of the account owner, it returns true once succeeded
The approved value is recorded in the allowance state variable. It emits Approval event once approved 

transferFrom(address _from, address _to, uint256 _value): This verifies if the account owner has enough token to send, also verifies if the sender has enough approved token to send
it then transfer the token, update allowance, raise Transfer event and then return true.

The totalSupply of token is supplied at the deployment stage
