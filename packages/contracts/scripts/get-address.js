import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

async function main() {
    if (!process.env.PRIVATE_KEY) {
        console.error("PRIVATE_KEY not found in .env");
        return;
    }
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    console.log("Wallet Address:", wallet.address);
}

main();
