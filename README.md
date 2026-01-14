# 🚀 BlockMarket (Testnet)

**BlockMarket** is a **testnet-only Ethereum application** that combines a **blockspace marketplace** with a **gasless transaction execution layer**.

It enables:
- **Normal users** to send Ethereum transactions with a gasless, predictable UX
- **Advanced users** to **buy, sell, and manage blockspace commitments**, and use them for guaranteed execution

> ⚠️ This project runs entirely on **Ethereum testnet** and is built for learning, experimentation, and system-design exploration.

---

## 🧠 Problem

Ethereum transactions today rely on a **real-time gas auction**:

- Users must guess gas fees
- Transaction inclusion is uncertain
- UX is complex for non-technical users
- Congestion causes unpredictable fee spikes

This results in a poor experience for:
- End users
- dApp onboarding flows
- Developers building consumer-facing apps

---

## 💡 Solution

**BlockMarket** treats Ethereum **blockspace as a reservable resource**, not a last-second auction.

The app provides:
- Advance blockspace reservation (via ETHGas testnet infrastructure)
- Gasless or gas-abstracted transaction execution
- A marketplace UI to view, buy, sell, and manage blockspace commitments

---

## ✨ Key Features

### 🟢 Gasless Transaction UX
- Users send transactions without manually managing gas
- BlockMarket coordinates:
  - blockspace reservation
  - transaction submission
- Clear execution timeline:
Submitted → Reserved → Preconfirmed → Included

---

### 🔵 Blockspace Marketplace (Advanced)
- View available blockspace commitments
- Buy commitments for specific execution windows
- Use owned commitments for transactions
- Track commitment lifecycle (active / used / expired)

---

### 📊 Transparency & History
- Transaction history
- Execution status tracking
- Clear separation between reservation and execution

---

## 🧭 App Modes

BlockMarket supports **two modes** in a single application:

### 1️⃣ Execute (Default Mode)
- Gasless transaction flow
- Simple UI
- No trading complexity

### 2️⃣ Trade (Advanced Mode)
- Blockspace market view
- Buy and manage commitments
- Portfolio and usage history

---

## 🏗️ High-Level Architecture

```txt
Frontend (React 19)
│
│ REST / WebSocket
▼
Backend (Coordination Layer)
│
│ ETHGas Testnet APIs
▼
Ethereum Testnet
Why a Backend is Required

Even on testnet, a backend is needed to:

Coordinate gasless execution

Track blockspace commitment lifecycle

Prevent double usage of commitments

Cache market data

Track transaction states

The backend:

❌ Does NOT custody funds

❌ Does NOT sign transactions on behalf of users

❌ Does NOT interact with mainnet

🧪 Testnet Only

All transactions use testnet ETH

Uses ETHGas testnet endpoints

No real economic value

No production guarantees

This project is for education and experimentation only.

🛠️ Tech Stack
Frontend

React 19

Tailwind CSS

pnpm

Wallet integration (MetaMask / WalletConnect)

Backend (Minimal)

Node.js

REST APIs

Lightweight DB (SQLite / PostgreSQL)

📁 Example Frontend Structure
src/
  pages/
    index.tsx          // Landing
    execute.tsx        // Gasless execution flow
    trade.tsx          // Marketplace
    portfolio.tsx
    history.tsx

  components/
    WalletConnect.tsx
    TxForm.tsx
    TxTimeline.tsx
    MarketTable.tsx

  lib/
    api.ts             // Backend API client
    eth.ts             // Ethereum helpers
🧪 Getting Started (Frontend)
pnpm install
pnpm dev
Requirements:

Wallet connected to Ethereum testnet

Backend service running

Environment variables configured
📌 Non-Goals

❌ Mainnet support

❌ Custodial wallets

❌ Validator or consensus logic

❌ Full exchange order matching

❌ Real fund handling
🧠 Purpose of This Project

BlockMarket is designed to:

Explore blockspace as a product

Demonstrate gas abstraction patterns

Showcase system-level Web3 thinking

Serve as a portfolio-grade infrastructure project
📜 License

MIT
