const SampleToken = artifacts.require("SampleToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("SampleToken", function (/* accounts */) {
  it("should assert true", async function () {
    const sampleToken =  await SampleToken.deployed();
   
    const totalSupply = await sampleToken.totalSupply();
    assert.equal(totalSupply.toNumber(), 1000000);
  });
});
