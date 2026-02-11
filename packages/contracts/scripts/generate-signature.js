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
    const domain = "neon-jump-base-9lww.vercel.app";

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
    const signatureHex = await wallet.signMessage(signingInput);

    // Convert hex signature to bytes then to base64url
    const signatureBytes = ethers.getBytes(signatureHex);
    const encodedSignature = Buffer.from(signatureBytes)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    console.log("JFS Account Association Components:");
    console.log(JSON.stringify({
        header: encodedHeader,
        payload: encodedPayload,
        signature: encodedSignature
    }, null, 2));
}

main();
