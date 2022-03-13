const LXR = artifacts.require('LXR.sol')
const LXRNFT = artifacts.require('LXRNFT.sol')
const LXRGAME = artifacts.require('LXRGame.sol')
const BN = web3.utils.BN;
const truffleAssert = require('truffle-assertions');
const assert = require("assert");

contract("Loxar Game Contracts Test", accounts => {
  let lxr = null;
  let lxrnft;
  let lxrgame;

  beforeEach(async () => {    
    if (lxr == null) {
      lxr = await LXR.deployed();
      lxrnft = await LXRNFT.deployed();
      lxrgame = await LXRGAME.deployed();

      await lxrnft.addWhitelist(accounts);

      console.log("LXR: ", lxr.address);      
      console.log("LXRNFT: ", lxrnft.address);      
      console.log("LXRGame: ", lxrgame.address);      
    }
  });

  it("Initialize", async () => {   
    let whitelist0 = await lxrnft.isWhitelist.call(accounts[0]);
    assert.equal(whitelist0, true, "failed to add whitelist");    
  });

  it("Mint Nfts", async () => {   
    await lxrnft.mintAdmin(accounts[0], 5);
    let count0 = await lxrnft.balanceOf.call(accounts[0]);
    assert.equal(count0, 5, "failed to mintAdmin");

    for (let i = 0; i < 4; i++) {
      await lxrnft.mintToken({from: accounts[1], value: web3.utils.toWei('0.4', 'ether')});
    }      
    let count1 = await lxrnft.balanceOf.call(accounts[1]);
    assert.equal(count1, 4, "failed to mintToken account1");

    for (let i = 0; i < 3; i++) {
      await lxrnft.mintToken({from: accounts[2], value: web3.utils.toWei('0.4', 'ether')});
    }
    let count2 = await lxrnft.balanceOf.call(accounts[2]);
    assert.equal(count2, 3, "failed to mintToken account2");    
  });

  it("Manage Squads", async () => {   
    // create squads
    let ids = await lxrnft.myNFTs();
    let squardID = await lxrgame.createSquad(ids);
    var sID = new BN(squardID);
    
    // get squad from id
    let {hgstlv, hgstwins, totalpower, totalrarity, nftIds} = await lxrgame.getSquadFromId.call(sID);
    console.log("SQUAD INFO: ", nftIds);      

    // play game and get result
    await lxrgame.playGame(sID, 1);

    // delete squad
    await lxrgame.deleteSquad(sID);
  })  

});


