const assert = require("assert");
const { ethers } = require("hardhat");

describe("crowdfundingg", function () {
  let Crowdfunding, crowdfunding, owner, donor1;

  beforeEach(async () => {
    [owner, donor1] = await ethers.getSigners();
    Crowdfunding = await ethers.getContractFactory("crowdfundingg");
    crowdfunding = await Crowdfunding.deploy();
    await crowdfunding.waitForDeployment();
  });

  it("creates a campaign with correct details", async () => {
    await crowdfunding.createCampaign("Help Kids", ethers.parseEther("5"));

    const campaign = await crowdfunding.getCampaign(0);

    assert.strictEqual(campaign[1], "Help Kids"); 
    assert.strictEqual(
      campaign[2].toString(),
      ethers.parseEther("5").toString()
    ); // goal
    assert.strictEqual(campaign[3].toString(), "0");
    assert.strictEqual(campaign[4], false); 
  });

  it("accepts donations and updates raised amount", async () => {
    await crowdfunding.createCampaign("Plant Trees", ethers.parseEther("2"));
    await crowdfunding.connect(donor1).donate(0, { value: ethers.parseEther("1") });

    const campaign = await crowdfunding.getCampaign(0);

    assert.strictEqual(
      campaign[3].toString(),
      ethers.parseEther("1").toString()
    ); 
    assert.strictEqual(campaign[4], false); 
  });

  it("transfers funds to creator and marks campaign completed when goal is met", async () => {
    await crowdfunding.createCampaign("Animal Rescue", ethers.parseEther("1"));

    const before = await ethers.provider.getBalance(owner.address);

    await crowdfunding.connect(donor1).donate(0, { value: ethers.parseEther("1") });

    const after = await ethers.provider.getBalance(owner.address);
    const campaign = await crowdfunding.getCampaign(0);

    assert.ok(after > before); 
    assert.strictEqual(campaign[4], true); 
  });
});
