# 🚀 SkillChain – Web3 GitHub Project Credentialing dApp

SkillChain is a decentralized application (dApp) that allows developers to **showcase their real GitHub projects on-chain**, creating an immutable and verifiable portfolio tied to their wallet identity.

---

## 🌟 Features

### 🖥 Frontend
- ✨ **Premium UI** built with Chakra UI and a clean white/gold/charcoal theme
- 🌐 **Responsive layout** with React Router and soft-glassy design
- 🎆 Stunning **3D animated background** using Vanta.js (NET effect)

### 🔗 Web3 Integration
- 🔐 **MetaMask Wallet connect** (connect, disconnect, and account switch)
- 📡 **Ethers.js v6** to read/write from smart contract
- 🧠 **Smart contract integration** to store project metadata on-chain

### 📁 Project Submission
- 📌 Submit a GitHub project by entering:
  - Project name
  - GitHub username and repo (live preview shown)
  - Tags (comma-separated)
- ✅ Validates real GitHub URLs before submission

### 🧭 Project Browsing
- 🔍 View all on-chain projects with:
  - Name, GitHub link, tags, wallet address, timestamp
- 🎯 Filter/search by name, tags, or wallet
- 👤 "My Projects" view to see what you’ve submitted

### 🛎 UX & Quality
- 🚨 Toast notifications for all major actions (connect, errors, submissions)
- ✅ Form validation and clean error handling

---

## 🛠 Tech Stack

| Layer       | Tools Used                          |
|-------------|-------------------------------------|
| Frontend    | React, Chakra UI, Vite, Vanta.js    |
| Blockchain  | Solidity, Hardhat, Ethers.js v6     |
| Wallet      | MetaMask (Flask if needed)          |
| Hosting     | GitHub Pages or Vercel (optional)   |

---

## 🧪 Local Setup

```bash
# clone the repo
git clone https://github.com/your-username/skillchain-dapp.git
cd skillchain-dapp

# install frontend dependencies
npm install

# run frontend
npm run dev

# open another terminal tab and start local blockchain
npx hardhat node

# deploy contract to local blockchain
npx hardhat run scripts/deploy.js --network localhost
