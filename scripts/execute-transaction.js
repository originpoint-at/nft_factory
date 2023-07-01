
const {ethers} = require("hardhat");

function pressAnyKey(msg = 'Press any key to continue') {
    return new Promise((resolve) => {
        console.log(msg || 'Press any key to continue');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', () => {
            process.stdin.destroy();
            resolve();
        });
    });
}

async function main() {

    const AgentNode = "0x80d2777d5a37cf8410ea7af6a93a1e1db130a6621e9674307618e2a5e001db23" // agent.i

    const owner_address = "0x417e35Bf9a91d7Cb83399103b8B545fB37ac338e";

    const registrar_address = "0x167A1fe9DA12b89Fe008f7575797F45513878752";
    const miner_address = "0xDB5B5275eE111e216846998Df43C5DF7Eef3Ce56";
    const multi_address = "0x3B6Aa2aC3BF4e3F097FC089C4043D0Aa40dECF97";

    let contract, tx, registrar, multicall;

    contract = await ethers.getContractFactory('Registrar');
    registrar = contract.attach(registrar_address);

    /*
    // Registrar.batchRegister(bytes32 agentNode, address to, string[] memory names)
    console.log('Registrar.batchRegister');
    args = [AgentNode, owner_address, ["alice"]]; // alice.i
    tx = await registrar.batchRegister(...args, { value: ethers.utils.parseEther("1.2") });
    await tx.wait();
    */

    contract = await ethers.getContractFactory('MultiCall');
    multicall = contract.attach(multi_address);

    // MultiCall.launchToChain(...)
    console.log('MultiCall.launchToChain');
    args = [
        registrar_address,
        AgentNode,
        ["uniswap"],
        miner_address,
        [],
        AgentNode,
        []
    ];
    tx = await multicall.launchToChain(...args, { value: ethers.utils.parseEther("1.2") });
    await tx.wait();
    /*
    function launchToChain(
        address registrar,
        bytes32 agentNode,
        string[] memory registers,
        address valueMining,
        string[] memory likees,
        bytes32 likerNode,
        string[] memory reserves
    ) external payable
    */

}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

