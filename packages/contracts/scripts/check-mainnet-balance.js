import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

async function main() {
    // Base Mainnet RPC
    const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
    const address = "0x74f676144fFF6f6b8Ff503069B4CfBeDFe9DE404";

    try {
        const balance = await provider.getBalance(address);
        console.log(`Balance on Base Mainnet: ${ethers.formatEther(balance)} ETH`);
    } catch (e) {
        console.error("Failed to fetch balance:", e.message);
    }
}

main();
