# TetherLab

TetherLab is an educational demo that explains how Tether (USDT) and stablecoins work.

**Live demo:** [stablecoin.scaleworks.tech](https://stablecoin.scaleworks.tech)

Students can:

- Create demo wallets
- View token balances
- Send simulated stablecoin payments
- Observe transaction statuses
- Adjust the token price to understand the dollar peg
- Explore how blockchain transfers work

## Technology

- Next.js frontend
- Coinbase Developer APIs
- Base Sepolia testnet
- Cloudflare Workers

## Running Locally

```bash
cd frontend
pnpm install
pnpm dev
```

Open the application at http://localhost:3000

## Important Note

TetherLab is not an official Tether or Coinbase product.

The learning simulator uses simulated USDT. The blockchain demonstration may use testnet USDC as a technical stand-in because it is available through Coinbase testnet tools. No real money is required.

## Purpose

The goal of TetherLab is to help students understand:

- What stablecoins are
- How USDT is designed to track the U.S. dollar
- How tokens move between wallets
- How blockchain transactions are recorded
- Why a stablecoin's price may sometimes vary slightly from $1
