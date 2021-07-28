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

# Sample token sale
We assigned token sale manager(admin) to this contract
We assigned SampleToken contract address to this contract, because it contains the tokens to be sold
We assigned or initialize the token price to this contract

The buyToken payable function accept the number of token the buyer wants and validates if the buyer is paying the exact amount expected to be paid, it validates that the number of token to be bought does not exceed the available token for the SampleToken contract
The buyTokens function then sell the token, keep track of the sold tokens and publish sell event

The endSale function verifies that only the admin could end sale, transfer the remaining token to the admin address and selfdestroy the SampleTokenSale contract (We still need to finalize this as there is an issue converting address to payable address with this version of solidity
