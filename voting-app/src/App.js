import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import VotingContract from './contracts/Voting.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Connect to MetaMask
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Get the currently selected account
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
          
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = VotingContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            VotingContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);

          // Check if the connected account has already voted
          const hasAlreadyVoted = await contractInstance.methods.hasVoted(accounts[0]).call();
          setHasVoted(hasAlreadyVoted);
        } else {
          alert('Please install MetaMask to use this dApp.');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    init();
  }, []);

  const handleVote = async () => {
    if (!selectedCandidate || !contract) return;

    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      console.log('Sending transaction from account:', accounts[0]);
      const gas = await contract.methods.vote(selectedCandidate).estimateGas({ from: accounts[0] });
      const tx = await contract.methods.vote(selectedCandidate).send({ from: accounts[0], gas });
      console.log('Transaction successful. Transaction hash:', tx.transactionHash);
      setHasVoted(true); // Update the state to reflect that the user has voted
      alert('Vote successful');
    } catch (error) {
      console.error('Error voting:', error);
      console.log('MetaMask RPC Error Response:', error.message); // Log MetaMask error response
      if (error.code === 4001) {
        alert('Transaction rejected by user.');
      } else {
        alert('Error voting. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadCandidates = async () => {
    if (!contract) return;

    try {
      const candidateCount = await contract.methods.getCandidateCount().call();
      const candidateList = [];
      for (let i = 0; i < candidateCount; i++) {
        const voteCount = parseInt(await contract.methods.totalVotesFor(i).call(), 10); // Parse vote count as an integer
        const candidate = await contract.methods.candidates(i).call();
        candidateList.push({ ...candidate, voteCount }); // Add vote count to candidate object
      }
      console.log(candidateList);
      setCandidates(candidateList);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [contract]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Voting App</h1>
        <p>Account: {accounts.length > 0 ? accounts[0] : 'No account connected'}</p> {/* Display connected account address */}
        {hasVoted && <p>You have already voted. Cannot vote again.</p>} {/* Display message if user has already voted */}
        <div>
          <h2>Candidates:</h2>
          <ul>
            {candidates.map((candidate, index) => (
              <li key={index}>
                {candidate.name} - Votes: {candidate.voteCount} {/* Display candidate name and vote count */}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Vote</h2>
          <select onChange={(e) => setSelectedCandidate(e.target.value)} disabled={hasVoted}>
            <option value="">Select a candidate</option>
            {candidates.map((candidate, index) => (
              <option key={index} value={index}>
                {candidate.name}
              </option>
            ))}
          </select>
          <button onClick={handleVote} disabled={!selectedCandidate || isLoading || hasVoted}>
            Vote
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
