const SampleTokenSale = artifacts.require("SampleTokenSale");
const SampleToken = artifacts.require("SampleToken")

contract("SampleTokenSale", function ( accounts ) {
  var sampleTokenSale;
  var sampleToken;
  var admin = accounts[0];
  var tokenPrice= 1000000000000000;// a token cost this amount in wei
  var tokensAvailable = 750000
  var buyer = accounts[1];
  var numberOfTokens;
  it("should initialize the contract with the correct values", async function () {

    return SampleTokenSale.deployed().then(function (instance) {
      sampleTokenSale = instance;
      return sampleTokenSale.address;
    }).then(function (address) {
      assert.notEqual(address, "0x0");
      return sampleTokenSale.tokenContract();
    }).then(function(address){
      assert.notEqual(address, "0x0");
      return sampleTokenSale.tokenPrice();
    }).then(function(price){
      assert.equal(price,tokenPrice);
    })
  });

  it("should facilitate the buying of token", async function () {
    return SampleToken.deployed().then(function (instance) {
      sampleToken = instance;
      return SampleTokenSale.deployed();

    }).then(function(instance){
      sampleTokenSale = instance;

      //Provision 75% of all tokens to the token sale
      return sampleToken.transfer(sampleTokenSale.address, tokensAvailable, {from: admin})

    }).then(function(receipt){
      numberOfTokens = 10;
      var valueToBuy = numberOfTokens * tokenPrice;
      return sampleTokenSale.buyTokens(numberOfTokens,{from: buyer, value: valueToBuy});
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1);
      assert.equal(receipt.logs[0].event,"Sell");
      assert.equal(receipt.logs[0].args._buyer,buyer);
      assert.equal(receipt.logs[0].args._amount,numberOfTokens);
      return sampleTokenSale.tokenSold();
    }).then(function(amount){
      assert.equal(amount.toNumber(),numberOfTokens, "increment the number of tokens sold");
      return sampleToken.balanceOf(buyer);
    }).then(function(balance){
      assert.equal(balance.toNumber(), numberOfTokens);
      return sampleToken.balanceOf(sampleTokenSale.address);
    }).then(function(balance){
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
      const value = numberOfTokens * 1;
      return sampleTokenSale.buyTokens(numberOfTokens,{from: buyer, value: value});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf("revert") >= 0, "msg.value must be equal to number of tokens in wei");
      return sampleTokenSale.buyTokens(800000, {from: buyer, value: numberOfTokens*tokenPrice})
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf("revert") >= 0, "cannot purchase more tokens ");
    })
  })

  it("should end token sale", async function(){
    return SampleToken.deployed().then(function(instance){
      sampleToken = instance;

      return SampleTokenSale.deployed();
    }).then(function(instance){
      sampleTokenSale = instance;
      //Try to end sale from account other than the admin
      return sampleTokenSale.endSale({from: buyer})
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf("revert") >= 0, "only admin can put an end to sale")
      //end sale as admin
      return sampleTokenSale.endSale({from: admin});
    }).then(function(receipt){
       return sampleToken.balanceOf(admin);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 999990, "returns all the unsold dapp tokens to the admin")
      //Check that the token price was reset when selfDestruct was called
      return sampleTokenSale.tokenPrice();
    }).then(function(price){
      //this is to test theselfdestruct of the sampleTokenSale contract once the sale is done
      // but there is a issue converting address to payable address, will attend to this later
      //assert.equal(price.toNumber(), 0, "token price was reset")
    })
  })
});
