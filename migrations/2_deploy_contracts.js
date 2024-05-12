const VotingPermissions = artifacts.require("VotingPermissions");
const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  const candidateNames = ["Candidate 1", "Candidate 2", "Candidate 3"]; // Add more candidates if needed

  deployer.deploy(VotingPermissions).then(function() {
    return deployer.deploy(Voting, candidateNames, VotingPermissions.address);
  });
};

// const VotingPermissions = artifacts.require("VotingPermissions");
// const Voting = artifacts.require("Voting");

// module.exports = function (deployer) {
//   const candidateNames = ["Candidate 1", "Candidate 2", "Candidate 3"]; // Add more candidates if needed
//   deployer.deploy(VotingPermissions).then(function() { // Step 1: Deploy VotingPermissions contract
//     return Voting.deployed().then(function(votingInstance) { // Step 2: Retrieve owner address
//       return deployer.deploy(VotingPermissions, candidateNames, votingInstance.address); // Step 3: Deploy VotingPermissions contract with Voting contract address and owner address
//     });
//   });
// };

