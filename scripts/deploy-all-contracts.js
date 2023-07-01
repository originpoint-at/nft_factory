const {utils} = require ("ethers");
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

    const DAO = "0x79CEc4c26f1d3f7F9C1afAdB4783CCC7F8064743";
    const owner_address = "0x8f5fBAF9A91D951c6545B12aE6485ae7d76Ec82e";
    const INode = "0x37e0f248731a8e19116ae18dddd5cd1053123e9804db88dae23e254b8cfc1256";
    const ONode = "0x3f8033937d565e0a60f36e045c4f383453ba5ad619b395de60965dfa1ee448f9";
    const RootNode = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const AgentNode = "0x80d2777d5a37cf8410ea7af6a93a1e1db130a6621e9674307618e2a5e001db23" // agent.i

    let contract, args, tx;

    // Beacon
    args = [DAO];
    contract = await ethers.getContractFactory('Beacon');
    console.log('Deploying Beacon...');
    const beacon = await contract.deploy(...args);
    await beacon.deployed();
    console.log('Beacon deployed to:', beacon.address);
    const beacon_address = beacon.address;

    // TreeDB
    args = [beacon_address];
    contract = await ethers.getContractFactory('TreeDB');
    console.log('Deploying TreeDB...');
    const db = await contract.deploy(...args);
    await db.deployed();
    console.log('TreeDB deployed to:', db.address);
    const db_address = db.address;

    // Filter
    args = [beacon_address];
    contract = await ethers.getContractFactory('Filter');
    console.log('Deploying Filter...');
    const filter = await contract.deploy(...args);
    await filter.deployed();
    console.log('Filter deployed to:', filter.address);
    const filter_address = filter.address;

    // Buffer
    args = [beacon_address, "Buffer", "BUF"];
    contract = await ethers.getContractFactory('Buffer');
    console.log('Deploying Buffer...');
    const buffer = await contract.deploy(...args);
    await buffer.deployed();
    console.log('Buffer deployed to:', buffer.address);
    const buffer_address = buffer.address;

    // Registrar
    args = [beacon_address, "i", "10000000000000000", 0, 1000]; // 0.01 ether
    contract = await ethers.getContractFactory('Registrar');
    console.log('Deploying Registrar...');
    const registrar = await contract.deploy(...args);
    await registrar.deployed();
    console.log('Registrar deployed to:', registrar.address);
    const registrar_address = registrar.address;

    // ValueMining
    args = [beacon_address, "i", "1000000000000000"]; // 0.001 ether
    contract = await ethers.getContractFactory('ValueMining');
    console.log('Deploying ValueMining...');
    const miner = await contract.deploy(...args);
    await miner.deployed();
    console.log('ValueMining deployed to:', miner.address);
    const miner_address = miner.address;

    // Vault
    args = [beacon_address];
    contract = await ethers.getContractFactory('Vault');
    console.log('Deploying Vault...');
    const vault = await contract.deploy(...args);
    await vault.deployed();
    console.log('Vault deployed to:', vault.address);
    const vault_address = vault.address;

    // Editor
    args = [beacon_address, registrar_address, "0x0000000000000000000000000000000000000000"];
    contract = await ethers.getContractFactory('Editor');
    console.log('Deploying Editor...');
    const editor = await contract.deploy(...args);
    await editor.deployed();
    console.log('Editor deployed to:', editor.address);
    const editor_address = editor.address;

    // Market
    args = [beacon_address];
    contract = await ethers.getContractFactory('Market');
    console.log('Deploying Market...');
    const market = await contract.deploy(...args);
    await market.deployed();
    console.log('Market deployed to:', market.address);
    const market_address = market.address;

    // Resolver
    args = [beacon_address];
    contract = await ethers.getContractFactory('Resolver');
    console.log('Deploying Resolver...');
    const resolver = await contract.deploy(...args);
    await resolver.deployed();
    console.log('Resolver deployed to:', resolver.address);
    const resolver_address = resolver.address;

    await pressAnyKey();

    // Beacon.setXXX...
    console.log('Beacon.setDB');
    args = [db_address];
    tx = await beacon.setDB(...args);
    await tx.wait();

    console.log('Beacon.setBuffer');
    args = [buffer_address];
    tx = await beacon.setBuffer(...args);
    await tx.wait();

    console.log('Beacon.setFilter');
    args = [filter_address];
    tx = await beacon.setFilter(...args);
    await tx.wait();

    console.log('Beacon.setVault');
    args = [vault_address];
    tx = await beacon.setVault(...args);
    await tx.wait();

    console.log('Beacon.setEditor');
    args = [editor_address];
    tx = await beacon.setEditor(...args);
    await tx.wait();

    console.log('Beacon.setMarket');
    args = [market_address];
    tx = await beacon.setMarket(...args);
    await tx.wait();

    console.log('Beacon.setResolver');
    args = [resolver_address];
    tx = await beacon.setResolver(...args);
    await tx.wait();

    // Buffer.setOperators
    console.log('Buffer.setOperators');
    args = [[registrar_address, miner_address, editor_address], true];
    tx = await buffer.setOperators(...args);
    await tx.wait();

    // Buffer.activate(bytes32 parent, address owner, uint64 expire, string memory _name, bytes memory _data)
    console.log('Buffer.activate');
    args = [RootNode, DAO, 0, "i", "0x"];
    tx = await buffer.activate(...args);
    await tx.wait();

    // TreeDB.setOperators
    console.log('TreeDB.setOperators');
    args = [[registrar_address, miner_address, editor_address], true];
    tx = await db.setOperators(...args);
    await tx.wait();

    // TreeDB.activate(bytes32 parent, address owner, uint64 expire, string memory _name, bytes memory _data)
    console.log('TreeDB.activate');
    args = [RootNode, DAO, 0, "i", "0x"];
    tx = await db.activate(...args);
    await tx.wait();

    console.log('TreeDB.activate');
    args = [INode, owner_address, 0, "agent", "0x"]; // agent.i
    tx = await db.activate(...args);
    await tx.wait();

    // Registrar.batchRegister(bytes32 agentNode, address to, string[] memory names)
    console.log('Registrar.batchRegister');
    args = [AgentNode, DAO, ["buffalo"]]; // buffalo.i
    tx = await registrar.batchRegister(...args, { value: ethers.utils.parseEther("1.2") });
    await tx.wait();

    // Registrar.batchRegister(bytes32 agentNode, address to, string[] memory names)
    console.log('Registrar.batchRegister');
    args = [AgentNode, owner_address, ["richard"]]; // richard.i
    tx = await registrar.batchRegister(...args, { value: ethers.utils.parseEther("1.2") });
    await tx.wait();

    // MultiCall
    args = [beacon_address];
    contract = await ethers.getContractFactory('MultiCall');
    console.log('Deploying MultiCall...');
    const multi = await contract.deploy(...args);
    await multi.deployed();
    console.log('MultiCall deployed to:', multi.address);
    const multi_address = multi.address;

    console.log('MultiCall.addNewTarget');
    args = [registrar_address, miner_address];
    tx = await multi.addNewTarget(...args);
    await tx.wait();

    // MultiCall.launchToChain(...)
    console.log('MultiCall.launchToChain');
    args = [
        0,
        "0x95f084ab1da347905bc2a6b76ab903b16f01f78ad100030edb67863aa430f449",
        "0x80d2777d5a37cf8410ea7af6a93a1e1db130a6621e9674307618e2a5e001db23",
        [[], []],
        ["uniswap"],
        [],
        [],
    ];
    tx = await multi.launchToChain(...args, { value: ethers.utils.parseEther("1.2") });
    await tx.wait();
    /*
    function launchToChain(
        uint64 index,
        bytes32 liker,
        bytes32 agent,
        bytes32[][2] calldata orders,
        string[] calldata registers,
        string[] calldata reserves,
        string[] calldata likees
    ) external payable {
    */
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

/*
    // Parser
    args = [];
    contract = await ethers.getContractFactory('Parser');
    console.log('Deploying Parser...');
    const parser = await contract.deploy(...args);
    await parser.deployed();
    console.log('Parser deployed to:', parser.address);
    const parser_address = parser.address;

    // TreeDB
    args = [beacon_address];
    contract = await ethers.getContractFactory('TreeDB', {
        libraries: {
            Parser: parser_address,
        },
    });
    console.log('Deploying TreeDB...');
    const db = await contract.deploy(...args);
    await db.deployed();
    console.log('TreeDB deployed to:', db.address);
    const db_address = db.address;

*/

