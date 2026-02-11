import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    'base-sepolia': {
      url: 'https://sepolia.base.org',
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1000000000,
    },
    'base-mainnet': {
      url: 'https://mainnet.base.org',
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1000000000,
    },
  },
};
