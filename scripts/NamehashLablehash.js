const hre = require("hardhat");
const namehash = require('eth-ens-namehash'); // namehash & normalize
// const tld = "test";
const ethers = hre.ethers;
const utils = ethers.utils;
const labelhash = (label) => utils.keccak256(utils.toUtf8Bytes(label))
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

// https://docs.ens.domains/contract-api-reference/name-processing
// https://github.com/recursive-bloom/learn-ens

async function main() {
    const root = ZERO_HASH;
    console.log("namehash of root: " + root);

    const eth = labelhash("eth");
    console.log("LABELHASH of eth: " + eth);

    const eth_root = namehash.hash("eth");
    console.log("namehash of eth: " + eth_root);

    const did_root = namehash.hash("did");
    console.log("namehash of did: " + did_root);

    const dao_root = namehash.hash("dao");
    console.log("namehash of dao: " + dao_root);

    const nft_root = namehash.hash("nft");
    console.log("namehash of nft: " + nft_root);

    const free_root = namehash.hash("free");
    console.log("namehash of free: " + free_root);

    const bool_root = namehash.hash("bool");
    console.log("namehash of bool: " + bool_root);

    const meta_root = namehash.hash("meta");
    console.log("namehash of meta: " + meta_root);

    const test_root = namehash.hash("test");
    console.log("namehash of test: " + test_root);

    const dapp_root = namehash.hash("dapp");
    console.log("namehash of dapp: " + dapp_root);

    const infrastructure_root = namehash.hash("did-dao-infrastructure");
    console.log("namehash of infrastructure: " + infrastructure_root);

    const community_root = namehash.hash("did-dao-community");
    console.log("namehash of community: " + community_root);

    const alice_eth = namehash.hash("alice.eth");
    console.log("alice.eth: " + alice_eth);

    const www_alice_eth = namehash.hash("www.alice.eth");
    console.log("www.alice.eth: " + www_alice_eth);

    const bob_eth = namehash.hash("bob.eth");
    console.log("bob.eth: " + bob_eth);

    let bob_163_eth = namehash.hash("bob-163.eth");
    console.log("bob-163.eth: " + bob_eth);

    bob_163_eth = namehash.hash("BoB-163.ETH");
    console.log("BoB-163.ETH: " + bob_163_eth);

    let example_eth = namehash.hash("example.eth");
    console.log("example.eth: " + example_eth);

    let buffalo_eth = namehash.hash("buffalo.eth");
    console.log("buffalo.eth: " + buffalo_eth);

    let buffalo_did = namehash.hash("buffalo.did");
    console.log("buffalo.did: " + buffalo_did);

    let buffalo_dao = namehash.hash("buffalo.dao");
    console.log("buffalo.dao: " + buffalo_dao);

    const i_root = namehash.hash("i");
    console.log("namehash of i: " + i_root);

    const o_root = namehash.hash("o");
    console.log("namehash of o: " + o_root);

    const e_root = namehash.hash("e");
    console.log("namehash of e: " + e_root);

    let buffalo_i = namehash.hash("buffalo.i");
    console.log("buffalo.i: " + buffalo_i);

    let agent_i = namehash.hash("agent.i");
    console.log("agent.i: " + agent_i);

    let richard_i = namehash.hash("richard.i");
    console.log("richard.i: " + richard_i);

    let buffalo_o = namehash.hash("buffalo.o");
    console.log("buffalo.o: " + buffalo_o);

    let buffalo_e = namehash.hash("buffalo.e");
    console.log("buffalo.e: " + buffalo_e);

};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


/**

 namehash of root: 0x0000000000000000000000000000000000000000000000000000000000000000
 LABELHASH of eth: 0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0
 namehash of eth: 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae
 namehash of did: 0x8a74fc6994ef0554dd9cc95c3391f9cd66152031a0c1feacb835e3890805af5f
 namehash of dao: 0xb5f2bbf81da581299d4ff7af60560c0ac854196f5227328d2d0c2bb0df33e553
 namehash of nft: 0xb75cf4f3d8bc3deb317ed5216d898899d5cc6a783f65f6768eb9bcb89428670d
 namehash of free: 0x5e8583a43e6021bb6c77d2b9d3b3062ff9495d42c4bca82d6e494d591f6e7492
 namehash of bool: 0x40ac243157e8ee9e1d3ebb43a6efa84aa344e17e5705664d894a8077933e41cf
 namehash of meta: 0x033549da90d902eebcededec7286e6a5f4e7b23484d4b06c20bd6ed60e05d4ef
 namehash of test: 0x04f740db81dc36c853ab4205bddd785f46e79ccedca351fc6dfcbd8cc9a33dd6
 namehash of dapp: 0xaeb80943d7970b602b395cbc8c7f1a6d98738aee6d23e7689d14efe266704067
 namehash of infrastructure: 0x5e64ffda1b6008390ef0c6caa1ab62e7b074b9cd05b17690e02ed6499f360d72
 namehash of community: 0x804df6cd44135637e467d9473813c3abfd6195095bf410c52abab08339eef16e
 alice.eth: 0x787192fc5378cc32aa956ddfdedbf26b24e8d78e40109add0eea2c1a012c3dec
 www.alice.eth: 0x507dd50c1f1e2dbe33ca63e3ced943963de5b87e521fc86de8242616ea28ed05
 bob.eth: 0xbe11069ec59144113f438b6ef59dd30497769fc2dce8e2b52e3ae71ac18e47c9
 bob-163.eth: 0xbe11069ec59144113f438b6ef59dd30497769fc2dce8e2b52e3ae71ac18e47c9
 BoB-163.ETH: 0xc6b6c61f2b79b5dc36e2f67e6542c44265926954211ee460bc94190d47a4606c
 example.eth: 0x3d5d2e21162745e4df4f56471fd7f651f441adaaca25deb70e4738c6f63d1224
 buffalo.eth: 0x4e772f62035453f381d9e8495f65ea4d5c90168c61878c755d8b2c9170e259d2
 buffalo.did: 0xc6cbe29b02227ba1bb49c0da438c639867e06abe8377a4e69e75a8b705b17b10
 buffalo.dao: 0x6b8195193b4ceb1f3a1540b509276df357c01f33b5d97b29e7a6991790b50c94
 namehash of i: 0x37e0f248731a8e19116ae18dddd5cd1053123e9804db88dae23e254b8cfc1256
 namehash of o: 0x3f8033937d565e0a60f36e045c4f383453ba5ad619b395de60965dfa1ee448f9
 buffalo.i: 0x95f084ab1da347905bc2a6b76ab903b16f01f78ad100030edb67863aa430f449
 agent.i: 0x80d2777d5a37cf8410ea7af6a93a1e1db130a6621e9674307618e2a5e001db23
 richard.i: 0x56860480f0e94690e15104915f679b855bcd5d0f134ee9f99819824b97b73ee4
 buffalo.o: 0x7628e6656d6a39fa1ff815a6ada8070eadd57871a44b5557f19034bd3d01ce55

 date +%s
 1953978695


**/
