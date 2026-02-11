# Neon Jump on Base

## Prerequisites
- Node.js (LTS)
- Coinbase Wallet or MetaMask extension

## Setup
1.  **Frontend**:
    ```bash
    cd packages/app
    npm install
    npm run dev
    ```

2.  **Smart Contracts**:
    -   Create `packages/contracts/.env` and add your `PRIVATE_KEY`.
    -   Compile:
        ```bash
        cd packages/contracts
        npx hardhat compile
        ```
    -   Deploy to Base Sepolia:
        ```bash
        npx hardhat run scripts/deploy.js --network base-sepolia
        ```

## Game Configuration
-   Open `packages/app/src/services/WalletService.js` and update `to: '0xYourDevWalletAddressHere'` with your wallet address to receive donations.

## Running
Run the helper script:
```powershell
./run_game.ps1
```
