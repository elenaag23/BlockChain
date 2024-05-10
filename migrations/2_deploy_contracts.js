// migrations/2_deploy_contracts.js
const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  // Define candidate names
  const candidateNames = ["Candidate 1", "Candidate 2", "Candidate 3"]; // Add more candidates if needed

  // Deploy Voting contract with candidate names
  deployer.deploy(Voting, candidateNames);
};

