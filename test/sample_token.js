const SampleToken = artifacts.require("SampleToken");

contract("SampleToken", function ( accounts ) {
  it("should allocate initial supply upon deployment", async function () {
    const sampleToken =  await SampleToken.deployed();
   
    const totalSupply = await sampleToken.totalSupply();
    const adminBalance = await sampleToken.balanceOf(accounts[0]);

    assert.equal(totalSupply.toNumber(), 1000000);
    assert.equal(adminBalance.toNumber(), 1000000);
  });

  it("should initialize the contract with correct values", async function(){
    const sampleToken =  await SampleToken.deployed();
    const name = await sampleToken.name();
    const symbol = await sampleToken.symbol();
    const standard = await sampleToken.standard();

    assert.equal(name, "SampleToken");
    assert.equal(symbol, "SMLT");
    assert.equal(standard, "Sample Token v1.0");
  })

  it("should transfer tokens", async function(){
    let sampleToken;

    sampleToken = await SampleToken.deployed();
    const transferResult = await sampleToken.transfer(accounts[1], 100, {from: accounts[0]});
    const recipientBalance = await sampleToken.balanceOf(accounts[1]);
    const balance = await sampleToken.balanceOf(accounts[0]);

    assert.equal(recipientBalance, 100);
    assert.equal(balance, 999900);

    assert.equal(transferResult.logs.length, 1);
    assert.equal(transferResult.logs[0].event, "Transfer");
    assert.equal(transferResult.logs[0].args.from, accounts[0]);
    assert.equal(transferResult.logs[0].args.to, accounts[1]);
    assert.equal(transferResult.logs[0].args.value.toNumber(), 100);
  })

  it("should fail to transfer more than/equal to the balance", async function(){
      let sampleToken;
     return SampleToken.deployed().then(function(instance){
       sampleToken = instance;
       return sampleToken.transfer(accounts[1], 1000000, {from: accounts[0]});
     }).then(assert.fail).catch(function(error){
       assert(error.message.indexOf("revert") >= 0);
       return sampleToken.transfer.call(accounts[1], 10, {from: accounts[0]});
     }).then(function(success){
       assert.equal(success, true);
     });

  });
});
