const fs = require("fs")
const path = require("path")

require("dotenv").config({ path: path.resolve(__dirname, "./.env") })
require("@nomicfoundation/hardhat-toolbox")
require("hardhat-contract-sizer")

for (const f of fs.readdirSync(path.join(__dirname, "hardhat"))) {
  require(path.join(__dirname, "hardhat", f))
}

const config = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],

    overrides: {
      "contracts/aggregator/MultiCall.sol": {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: false,
          },
        },
      },
    },

  },

  networks: {
    localhost: {
      loggingEnabled: true,
    },
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    coverage: {
      url: "http://127.0.0.1:8555", // Coverage launches its own ganache-cli client
    },
    template: {
      // url: process.env.ROPSTEN_URL || "",
      url: "https://http-testnet.cube.network",
      chainId: 1819,
      gas: 3000000,
      // gasPrice: "auto",
      gasPrice: 5000_000_000, // 5 gwei,
      accounts: { mnemonic: process.env.MNEMONICS !== undefined ? process.env.MNEMONICS : "" },
      // accounts: [privateKey],
      timeout: 200000,
    },
    mumbai: {
      // url: "https://rpc.ankr.com/polygon_mumbai",
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto", // 3 GWei
      gas: 2100_000,
    },
    polygon: {
      url: "https://rpc.ankr.com/polygon",
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 300_000_000_000, // 300 GWei
      gas: 4_000_000,
    },
    bsc: {
      url: "https://rpc.ankr.com/bsc",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto", // 3 GWei
      gas: 3_000_000,
    },
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    excludeContracts: ["mock/"],
  },
}

// npx hardhat flatten will be wrong for the output of console.log
// console.log(config);
// console.log(process.env.PRIVATE_KEY);
// console.log(process.env.MNEMONICS);

module.exports = config
