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

    const DAO = "0xF62c693309261a8D7bad53DA93D65a593892b406"; // the same as agent.i
    const owner_address = "0xF62c693309261a8D7bad53DA93D65a593892b406"; // owner of agent.i
    const INode = "0x37e0f248731a8e19116ae18dddd5cd1053123e9804db88dae23e254b8cfc1256";
    const ONode = "0x3f8033937d565e0a60f36e045c4f383453ba5ad619b395de60965dfa1ee448f9";
    const RootNode = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const AgentNode = "0x80d2777d5a37cf8410ea7af6a93a1e1db130a6621e9674307618e2a5e001db23" // agent.i

    let contract, args, tx;

    // Beacon
    args = [DAO];
    contract = await ethers.getContractFactory('Beacon');
    const beacon = await contract.deploy(...args);
    await beacon.deployed();
    console.log('Beacon deployed to:', beacon.address);
    const beacon_address = beacon.address;

    // Brand
    args = [beacon_address, "DAOG ID", "DAOG"];
    contract = await ethers.getContractFactory('Brand');
    const brand = await contract.deploy(...args);
    await brand.deployed();
    console.log('Brand deployed to:', brand.address);
    const brand_address = brand.address;

    // For OpenSea scanning the blockchain
    console.log('Beacon.setBrand');
    args = [brand_address];
    tx = await beacon.setBrand(...args);
    await tx.wait();

    // TreeDB
    args = [beacon_address];
    contract = await ethers.getContractFactory('TreeDB');
    const db = await contract.deploy(...args);
    await db.deployed();
    console.log('TreeDB deployed to:', db.address);
    const db_address = db.address;

    // Filter
    args = [beacon_address];
    contract = await ethers.getContractFactory('Filter');
    const filter = await contract.deploy(...args);
    await filter.deployed();
    console.log('Filter deployed to:', filter.address);
    const filter_address = filter.address;

    // Buffer
    args = [beacon_address, "Buffer", "BUF"];
    contract = await ethers.getContractFactory('Buffer');
    const buffer = await contract.deploy(...args);
    await buffer.deployed();
    console.log('Buffer deployed to:', buffer.address);
    const buffer_address = buffer.address;

    // Registrar
    args = [beacon_address, "i", 0, 0, 300];
    contract = await ethers.getContractFactory('Registrar');
    const registrar = await contract.deploy(...args);
    await registrar.deployed();
    console.log('Registrar deployed to:', registrar.address);
    const registrar_address = registrar.address;

    // ValueMining
    args = [beacon_address, "i", 0];
    contract = await ethers.getContractFactory('ValueMining');
    const miner = await contract.deploy(...args);
    await miner.deployed();
    console.log('ValueMining deployed to:', miner.address);
    const miner_address = miner.address;

    // Vault
    args = [beacon_address];
    contract = await ethers.getContractFactory('Vault');
    const vault = await contract.deploy(...args);
    await vault.deployed();
    console.log('Vault deployed to:', vault.address);
    const vault_address = vault.address;

    // Editor
    args = [beacon_address, registrar_address, "0x0000000000000000000000000000000000000000"];
    contract = await ethers.getContractFactory('Editor');
    const editor = await contract.deploy(...args);
    await editor.deployed();
    console.log('Editor deployed to:', editor.address);
    const editor_address = editor.address;

    // Market
    args = [beacon_address];
    contract = await ethers.getContractFactory('Market');
    const market = await contract.deploy(...args);
    await market.deployed();
    console.log('Market deployed to:', market.address);
    const market_address = market.address;

    // Resolver
    args = [beacon_address];
    contract = await ethers.getContractFactory('Resolver');
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

}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });


/*
Compiled 34 Solidity files successfully
Beacon deployed to: 0x54733332Ab76307bC0D6795EE4a571d05E4B266E
Brand deployed to: 0x4586b926C752F3583eFBd26F7759dcD48A68d9f6
Beacon.setBrand
TreeDB deployed to: 0x157575Ee9B3B13C3f27aBEd065b96E9C2AE3bf99
Filter deployed to: 0x0b2b25acC9E6B41BEb5548B2B2A557A39e15e9f8
Buffer deployed to: 0x8BeF12328dD682A28EB4BBEcc13590051aD07CdC
Registrar deployed to: 0x52BF0c26f7fAA11FEd4967Ea10FB837Fb181973D
ValueMining deployed to: 0x9C035781d82a70fdc16B82e59230C323BFc2A20A
Vault deployed to: 0x80A29CbBcfa532623dD216750B6c6935E53544dF
Editor deployed to: 0xc9B52217F5F70cB32c6C58ddB979642FD11568c3
Market deployed to: 0x603a125352232D2d64AB5255d46de6D77510575C
Resolver deployed to: 0xfe6DB2E499F9a73123a3738D3f2A9576C324608B
Press any key to continue
Beacon.setDB
Beacon.setBuffer
Beacon.setFilter
Beacon.setVault
Beacon.setEditor
Beacon.setMarket
Beacon.setResolver
Buffer.setOperators
Buffer.activate
TreeDB.setOperators
TreeDB.activate
TreeDB.activate
Deploying MultiCall...
MultiCall deployed to: 0x1C354194C5aF633eeCf4bD83807b5Dffb7D04A08
MultiCall.addNewTarget
*/


