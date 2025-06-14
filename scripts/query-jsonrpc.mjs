import { AlkanesRpc } from "../lib/rpc.js";

// const rpc = new AlkanesRpc({ baseUrl: 'https://alkanes.pyrosec.is' });
const prod_rpc = new AlkanesRpc({ baseUrl: 'https://mainnet.sandshrew.io/v2/lasereyes' });

// const balance = await rpc.protorunesbyaddress({
//   address: 'bc1pr8vjq0fk89f5sw3r4n9scrasvw7kaud9akhzw57c3ygycsjspvvseyjcma',
//   protocolTag: 1n,
// });

// console.log('Protorunes balance:', balance);


// const prod_balance = await prod_rpc.getbytecode({
//   block: 4n,
//   tx: 65518n,
// });

// console.log('Protorunes balance:', prod_balance);
// let tx = 26160n;
// // // Simulate transaction
// const simulation = await rpc.simulate({
//   alkanes: [],
//   block: '',
//   transaction: '',
//   height: 1000000n,
//   txindex: 0,
//   target: {
//     block: 2n,
//     tx: tx,
//   },
//   inputs: [99n],
//   pointer: 0,
//   refundPointer: 0,
//   vout: 0,
// });

// console.log('Simulation result:', simulation);
// // 
const prodsimulation = await prod_rpc.simulate({
  alkanes: [],
  block: '',
  transaction: '',
  height: 1000000n,
  txindex: 0,
  target: {
    block: 2n,
    tx: tx,
  },
  inputs: [99n],
  pointer: 0,
  refundPointer: 0,
  vout: 0,
});

console.log('prodsimulation result:', prodsimulation);


// diff balance: '082735FBD38C58D44087BAFB1D33584DDF669CC0C1C3D542082CC31F1B84CAC4'
// const txid = '000122924201B9D5F617524CD1C4DA991A70388575E6BE02B5BCFDF1305E2DD1' //96. minted out. but new indexer minted it here
// const txid = 'CCDC45DBF0427B63697CE0914A769D47F455CA221C6571F5709D6280F40A280C' //92
const txid = 'FB5CBE346E8144DF3A244BC5CB34643FB792CCCA7B38B18ADC69CDB76C6E3A60' //92

const balance = await prod_rpc.protorunesbyoutpoint({
  txid: txid,
  vout: 0,
  protocolTag: 1n,
});

console.log('Protorunes balance:', balance);


// const prod_balance = await prod_rpc.protorunesbyoutpoint({
//   txid: txid,
//   vout: 0,
//   protocolTag: 1n,
// });

// console.log('Protorunes balance:', prod_balance);

// let trace = await prod_rpc.trace({
//   vout: 6, txid: txid
// });

// console.log('trace result:', JSON.stringify(trace, (key, value) =>
//   typeof value === 'bigint' ? value.toString() + 'n' : value
// ));

//reverts
// let trace = await rpc.trace({
//   vout: 4, txid: "0664FC9A61F5D789478D26323FEB0E23165F78A8CE52484461D483303BD9442A"
// });

// console.log('466 trace result:', JSON.stringify(trace, (key, value) =>
//   typeof value === 'bigint' ? value.toString() + 'n' : value
// ));

// works
// let trace = await rpc.trace({
//   vout: 4, txid: "8BF101787934450931352550F2989D4AEB281DAFA99151C886607E1069178AE9"
// });

// console.log('467 trace result:', JSON.stringify(trace, (key, value) =>
//   typeof value === 'bigint' ? value.toString() + 'n' : value
// ));

//reverts
// trace = await rpc.trace({
//   vout: 4, txid: "B6CE851A52A55DD8D6023B50D75F63BC45127A56EB565C4CFCB615ACCB3F38E8"
// });

// console.log('468 trace result:', JSON.stringify(trace, (key, value) =>
//   typeof value === 'bigint' ? value.toString() + 'n' : value
// ));

//reverts
// let trace = await rpc.trace({
//   vout: 4, txid: "F72971536286B7E5938FA59221F5C76219E6F2E6D6F6613BBC98721D1DD27A4B"
// });

// console.log('469 trace result:', JSON.stringify(trace, (key, value) =>
//   typeof value === 'bigint' ? value.toString() + 'n' : value
// ));


// let t = await rpc.alkanesidtooutpoint({
//   block: 2n, tx: 16n
// });

// console.log('result:', t);
