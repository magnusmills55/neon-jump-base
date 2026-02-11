import { createWalletClient, custom, parseEther } from 'viem';
import { baseSepolia, base } from 'viem/chains';

export class WalletService {
    constructor() {
        this.walletClient = null;
        this.account = null;
        this.chain = baseSepolia; // Default to Base Sepolia for dev
    }

    async connect() {
        if (!window.ethereum) {
            alert("Please install a wallet like Coinbase Wallet or MetaMask!");
            return null;
        }

        this.walletClient = createWalletClient({
            chain: this.chain,
            transport: custom(window.ethereum)
        });

        const [address] = await this.walletClient.requestAddresses();
        this.account = address;
        return address;
    }

    async signLogin() {
        if (!this.walletClient || !this.account) return null;

        try {
            const signature = await this.walletClient.signMessage({
                account: this.account,
                message: `Login to Neon Jump\nTimestamp: ${Date.now()}`
            });
            return signature;
        } catch (error) {
            console.error("Login rejected:", error);
            return null;
        }
    }

    async donate(amountConfig) { // amountConfig in ETH string, e.g. "0.001"
        if (!this.walletClient || !this.account) return null;

        try {
            const hash = await this.walletClient.sendTransaction({
                account: this.account,
                to: '0xYourDevWalletAddressHere', // TODO: Make this configurable or from env
                value: parseEther(amountConfig),
                chain: this.chain
            });
            return hash;
        } catch (error) {
            console.error("Donation failed:", error);
            throw error;
        }
    }
}

export const walletService = new WalletService();
