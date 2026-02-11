import hre from "hardhat";

async function main() {
    const donationManager = await hre.ethers.deployContract("DonationManager");

    await donationManager.waitForDeployment();

    console.log(
        `DonationManager deployed to ${donationManager.target}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
