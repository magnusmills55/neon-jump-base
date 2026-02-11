import { ethers } from "ethers";

async function main() {
    // Optimism Mainnet RPC
    const provider = new ethers.JsonRpcProvider("https://mainnet.optimism.io");
    const idRegistryAddress = ethers.getAddress("0x00000000fc6c5f01fc30151999387bb99a9f489b");
    const userAddress = ethers.getAddress("0x74f676144fFF6f6b8Ff503069B4CfBeDFe9DE404");

    const abi = ["function idOf(address owner) view returns (uint256)"];
    const contract = new ethers.Contract(idRegistryAddress, abi, provider);

    try {
        const fid = await contract.idOf(userAddress);
        console.log(`FID for ${userAddress}: ${fid.toString()}`);
    } catch (e) {
        console.error("Failed to fetch FID:", e.message);
    }
}

main();
