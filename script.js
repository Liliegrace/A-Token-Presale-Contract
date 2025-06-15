const TokenPresaleCA = "0x1B462bbE2B3A7Def0ADC983687D80af94CAC6605";
const TokenPresaleABI = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_locktime","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buyPresale","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"lockTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenAmount","type":"uint256"}],"name":"sellTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newLocktime","type":"uint256"}],"name":"updateLocktime","outputs":[],"stateMutability":"nonpayable","type":"function"}]

let signer;
let TokenPresaleContract;
let provider;

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    document.getElementById("walletAddress").innerText = await signer.getAddress();

    contract = new ethers.Contract(TokenPresaleContract, contractABI, signer);

    loadBalance();
  } else {
    alert("Please install MetaMask!");
  }

  connectBtn.style.display = "none";
  disconnectBtn.style.display = "block";
}


function disconnectWallet(){
    window.location.reload();
}


async function buyTokens() {
  const ethAmount = document.getElementById("ethAmount").value;
  if (!ethAmount || ethAmount <= 0) return alert("Enter a valid ETH amount.");

  try {
    const tx = await contract.buyPresale({ value: ethers.utils.parseEther(ethAmount) });
    await tx.wait();
    alert("Tokens purchased!");
    loadBalance();
  } catch (err) {
    console.error(err);
    alert("Transaction failed.");
  }
}

async function loadBalance() {
  try {
    const balance = await contract.balances(await signer.getAddress());
    document.getElementById("tokenBalance").innerText = balance.toString();
  } catch (err) {
    console.error("Error loading balance:", err);
  }
}

async function sellTokens() {
  const contract = new ethers.Contract(TokenPresaleContract, contractABI, signer);
  if (!signer) {
    alert("Please connect your wallet first.");
    return;
  }
  const ethAmount = document.getElementById("ethAmount").value;
  
  const tx = await contract.sellTokens();
  console.log("Selling tokens...");
  await tx.wait();
  alert("Tokens sold!");
  loadBalance();
}


async function claimTokens() {
  try {
  const contract = new ethers.Contract(TokenPresaleContract, contractABI, signer);
  console.log("Claiming tokens...");
   
  const tx = await contract.claimTokens();
  await tx.wait();
  alert("Tokens claimed!");
  loadBalance();
  } catch (err) {
    console.error(err);
    alert("Claim failed.");
 }
}

