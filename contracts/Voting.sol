pragma solidity ^0.8.0;

contract Voting {
    // Struct to represent a candidate
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Array of candidates
    Candidate[] public candidates;

    // Mapping to track if an address has voted
    mapping(address => bool) public hasVoted;

    // Event emitted when a voter casts a vote
    event Voted(address indexed _voter, uint256 _candidateIndex);

    // Event emitted when a new candidate is added
    event CandidateAdded(string _name);

    // Owner of the contract
    address public owner;

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Constructor to initialize candidates and set owner
    constructor(string[] memory _candidateNames) {
        owner = msg.sender;
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
            emit CandidateAdded(_candidateNames[i]);
        }
    }

    // Function to vote for a candidate
    function vote(uint256 _candidateIndex) external {
        require(_candidateIndex < candidates.length, "Invalid candidate index");
        require(!hasVoted[msg.sender], "You have already voted");

        candidates[_candidateIndex].voteCount++;
        hasVoted[msg.sender] = true;
        emit Voted(msg.sender, _candidateIndex);
    }

    // Function to get the total votes for a candidate
    function totalVotesFor(uint256 _candidateIndex) external view returns (uint256) {
        require(_candidateIndex < candidates.length, "Invalid candidate index");
        return candidates[_candidateIndex].voteCount;
    }

    // Function to get the total number of candidates
    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }
}
