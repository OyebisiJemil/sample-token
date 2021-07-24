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

  it("should approve token for delegated transfer", async function(){
    let sampleToken;
    return SampleToken.deployed().then(function(instance){
      sampleToken = instance;
      return sampleToken.approve.call(accounts[1], 100, {from: accounts[0]});
    }).then(function(success){
      assert.equal(success, true);
      return sampleToken.approve(accounts[1], 100, {from: accounts[0]});
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, "Approval");
      assert.equal(receipt.logs[0].args.owner, accounts[0]);
      assert.equal(receipt.logs[0].args.spender, accounts[1]);
      assert.equal(receipt.logs[0].args.value.toNumber(), 100);

      return sampleToken.allowance(accounts[0], accounts[1]);//did account[0] approve account[1] 100 tokens?
    }).then(function(allowance){
      assert.equal(allowance.toNumber(), 100);
    });
  })

  it("should handle delegated token transfer", async function(){
    return SampleToken.deployed().then(function(instance){
      sampleToken = instance;
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[4];

      //Transfer some tokens to fromAccount
      return sampleToken.transfer(fromAccount, 100, {from: accounts[0]});
    }).then(function(receipt){
      //Approve spendingAccount to spend 10 tokens from fromAccount
      return sampleToken.approve(spendingAccount, 10, {from: fromAccount});
    }).then(function(receipt){
      //Try to transfer larger amount than the sender's balance
      return sampleToken.transferFrom(fromAccount, toAccount, 1000, {from: spendingAccount});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf("revert") >= 0);
      //Try to transfer less than the sender's balance
      return sampleToken.transferFrom(fromAccount, toAccount, 11, {from: spendingAccount});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf("revert") >= 0);
      return sampleToken.transferFrom.call(fromAccount, toAccount, 5, {from: spendingAccount});
    }).then(function(success){
      assert.isTrue(success);
      return sampleToken.transferFrom(fromAccount, toAccount, 5, {from: spendingAccount});
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, "Transfer");
      assert.equal(receipt.logs[0].args.from, fromAccount);
      assert.equal(receipt.logs[0].args.to, toAccount);
      assert.equal(receipt.logs[0].args.value.toNumber(), 5);
      return sampleToken.balanceOf(fromAccount);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 95);
      return sampleToken.balanceOf(toAccount);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 5);
      return sampleToken.allowance(fromAccount, toAccount);
    }).then(function(allowance){
      assert.equal(allowance.toNumber(), 0);
    })
  })
});
