import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function main() {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.error("PRIVATE_KEY not found in .env");
        return;
    }

    const wallet = new ethers.Wallet(privateKey);
    const fid = 2215171;
    const domain = "jump-base.vercel.app";

    const header = {
        fid: fid,
        type: "custody",
        key: wallet.address,
    };

    const payload = {
        domain: domain,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signingInput = `${encodedHeader}.${encodedPayload}`;

    // For custody type, Farcaster expects an EIP-191 signature of the signingInput
    const signature = await wallet.signMessage(signingInput);

    // The signature should be hex-encoded as per some docs, or base64url. 
    // Standard JFS uses hex for the signature part if it's external, or specialized encoding.
    // However, the Frames v2 manifest expects the JFS components.

    console.log("JFS Account Association Components:");
    console.log(JSON.stringify({
        header: encodedHeader,
        payload: encodedPayload,
        signature: signature
    }, null, 2));
}

main();
