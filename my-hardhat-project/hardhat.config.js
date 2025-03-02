/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  networks: {
    hardhat: {
      chainId: 31_337,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk", // Always same accounts
        count: 10, // Number of accounts
      }
    }
  },
  solidity: "0.8.20",
};