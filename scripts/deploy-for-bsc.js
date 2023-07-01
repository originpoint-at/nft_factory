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

    const DAO = "0xFdF4cD2b11E328f8E753A2AbfE3b4D9501499eCD";
    const ENode = "0x4e43809d01527ebfe0a21990d88d8b60b0303ff89a99a9e50b4c42f1429556a7";
    const RootNode = "0x0000000000000000000000000000000000000000000000000000000000000000";

    let contract, args, tx;

    // Beacon
    args = [DAO];
    contract = await ethers.getContractFactory('Beacon');
    const beacon = await contract.deploy(...args);
    await beacon.deployed();
    console.log('Beacon deployed to:', beacon.address);
    const beacon_address = beacon.address;

    // Brand
    args = [beacon_address, "EagleMask ID", "EMID"];
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

    // Registrar
    args = [beacon_address, "e", 0];
    contract = await ethers.getContractFactory('Registrar');
    const registrar = await contract.deploy(...args);
    await registrar.deployed();
    console.log('Registrar deployed to:', registrar.address);
    const registrar_address = registrar.address;
    const market_address = registrar.address;

    // Editor
    args = [beacon_address, registrar_address];
    contract = await ethers.getContractFactory('Editor');
    const editor = await contract.deploy(...args);
    await editor.deployed();
    console.log('Editor deployed to:', editor.address);
    const editor_address = editor.address;

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

    console.log('Beacon.setFilter');
    args = [filter_address];
    tx = await beacon.setFilter(...args);
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

    // TODO Beacon.setVault (it is an EOA, not vault contract)
    // TODO Registrar.setOperator(DAO, true); Registrar.setReceiver(...);

    // TreeDB.setOperators
    console.log('TreeDB.setOperators');
    args = [[registrar_address, editor_address], true];
    tx = await db.setOperators(...args);
    await tx.wait();

    // TreeDB.activate(bytes32 parent, address owner, uint64 expire, string memory _name, bytes memory _data)
    console.log('TreeDB.activate');
    args = [RootNode, DAO, 0, "e", "0x"];
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
    args = [registrar_address];
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
npx hardhat run scripts/deploy-for-bsc.js --network bsc
Compiled 42 Solidity files successfully
Beacon deployed to: 0x22337cCfDCf0F602756F8ebbE09c0BeD652b85B5
Brand deployed to: 0x1a5581215eef2D5a319e1cD2bC4845A7690784ce
Beacon.setBrand
TreeDB deployed to: 0x2B00531bc3B6093E95fA946CAAE36508ed1F0AfD
Filter deployed to: 0x58194A2dBE846654CCd41D5A60B6f4CA49A19e99
Registrar deployed to: 0x4e57Bd656076EBca3BA18b77BE13f2818ee246f6
Editor deployed to: 0x506E635cbEC534D05A3223CA50C5cC591351204e
Resolver deployed to: 0x4c083fB617C744C9e3E17cb8Ddd95A55A53DaBDF (deprecated)
Press any key to continue
Beacon.setDB
Beacon.setFilter
Beacon.setEditor
Beacon.setMarket
Beacon.setResolver
TreeDB.setOperators
TreeDB.activate
Deploying MultiCall...
MultiCall deployed to: 0xc471d8298E1131257cB41ea27fFBc15455B5D54a (deprecated)
MultiCall.addNewTarget

MultiCall 0x03420085b8CCbf104F7AB0F642FC102f765C1852 (deprecated)
Resolver 0x255dbe41fd5d1b39ae73abbeee1f2d0dc7bb084f

Registrar 0x2285b7b38f48e87a70bb92c7433bbc091274d228
MultiCall 0x2e64eb7a7558e35875db3dde8b0aab689dc0c23e
Resolver
Editor 0xA6299Fb98318E3c5F41a101Fd0131e30f4d28816
*/


