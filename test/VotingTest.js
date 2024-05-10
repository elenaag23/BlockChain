// test/VotingTest.js
const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  let votingInstance;

  beforeEach(async () => {
    votingInstance = await Voting.deployed();
  });

  it("should deploy the Voting contract properly", async () => {
    assert.ok(votingInstance.address);
  });

  it("should set the name variable correctly", async () => {
    const expectedName = "Voting Contract";
    const name = await votingInstance.name();
    assert.equal(name, expectedName, "Name variable not set correctly");
  });
});
