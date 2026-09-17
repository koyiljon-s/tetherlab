# TetherLab

  TetherLab is an educational demo that explains how Tether (USDT) and stablecoins work.

  Students can:

  - Create demo wallets
  - View token balances
  - Send simulated stablecoin payments
  - Observe transaction statuses
  - Adjust the token price to understand the dollar peg
  - Explore how blockchain transfers work

  ## Technology

  - Go backend
  - React frontend
  - PostgreSQL database
  - Docker
  - Coinbase Developer APIs
  - Base Sepolia testnet

  ## Important Note

  TetherLab is not an official Tether or Coinbase product.

  The learning simulator uses simulated USDT. The blockchain demonstration may use testnet USDC as a technical stand-in because it is available through Coinbase testnet tools. No
  real money is required.

  ## Running the Project

  Start PostgreSQL:

  ```bash
  docker compose up -d

  Start the backend:

  cd backend
  go run ./cmd/server

  Start the frontend:

  cd frontend
  npm install
  npm run dev

  Open the application at:

  http://localhost:3000

  ## Purpose

  The goal of TetherLab is to help students understand:

  - What stablecoins are
  - How USDT is designed to track the U.S. dollar
  - How tokens move between wallets
  - How blockchain transactions are recorded
  - Why a stablecoin’s price may sometimes vary slightly from $1