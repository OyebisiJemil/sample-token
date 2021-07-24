const SampleTokenSale = artifacts.require("SampleTokenSale");

contract("SampleTokenSale", function ( accounts ) {
  it("should initialize the contract with the correct values", async function () {
    var sampleTokenSale;
    var tokenPrice= 1000000000000000;// in wei
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
});
