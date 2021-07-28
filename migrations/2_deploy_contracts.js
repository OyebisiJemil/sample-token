const SampleToken = artifacts.require("SampleToken");
const SampleTokenSale =  artifacts.require("SampleTokenSale");

module.exports = function (deployer) {
  var tokenPrice= 1000000000000000;
  deployer.deploy(SampleToken, 1000000).then(() => {
    return deployer.deploy(SampleTokenSale, SampleToken.address, tokenPrice);
  });
};