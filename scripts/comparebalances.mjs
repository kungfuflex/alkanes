import { AlkanesRpc } from "../lib/rpc.js";
import fs from 'fs';
import { parse } from 'csv-parse';
const rpc = new AlkanesRpc({ baseUrl: 'http://sanguine-spectral-widowmaker.sandshrew.io:8380' });
// const rpc = new AlkanesRpc({ baseUrl: 'http://spirit-cauldron-meadhouse.sandshrew.io:8080' });

const signet_rpc = new AlkanesRpc({ baseUrl: 'https://signet.sandshrew.io/v2/lasereyes' });
const prod_rpc = new AlkanesRpc({ baseUrl: 'https://mainnet.sandshrew.io/v2/lasereyes' });
const subfrost_rpc = new AlkanesRpc({ baseUrl: 'https://mainnet.subfrost.io/v4/subfrost' });


const espoResponse = await fetch("https://api.alkanode.com/rpc", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "essentials.get_holders",
        params: {
            alkane: "2:56801",
            limit: 100,
            page: 1,
        },
    }),
});

const espoData = await espoResponse.json();

const bigIntReplacer = (key, value) =>
    typeof value === 'bigint' ? value.toString() : value;
function compareTokenValues(list1, list2, txid) {
    const groupAndSort = (list) => {
        const grouped = new Map();
        for (const outpoint of list) {
            for (const item of outpoint.runes) {
                const id = JSON.stringify(item.rune.id, bigIntReplacer);
                if (!grouped.has(id)) {
                    grouped.set(id, []);
                }
                grouped.get(id).push(item.balance);
            }
        }

        for (const id of grouped.keys()) {
            grouped.get(id).sort((a, b) => {
                try {
                    const valA = BigInt(a);
                    const valB = BigInt(b);
                    if (valA < valB) return -1;
                    if (valA > valB) return 1;
                    return 0;
                } catch (e) {
                    if (a < b) return -1;
                    if (a > b) return 1;
                    return 0;
                }
            });
        }
        return grouped;
    };

    const grouped1 = groupAndSort(list1);
    const grouped2 = groupAndSort(list2);

    let mismatchFound = false;

    for (const [idStr, values1] of grouped1.entries()) {
        const id = JSON.parse(idStr);
        if (!grouped2.has(idStr)) {
            console.error(`Mismatch for txid: ${txid}. Token with id ${idStr}, ${values1} found in new indexer but not in prod.`);
            mismatchFound = true;
            continue;
        }

        const values2 = grouped2.get(idStr);
        let i = 0;
        let j = 0;
        let tokenMismatchFound = false;

        const logMismatchHeader = () => {
            if (!tokenMismatchFound) {
                console.error(`Mismatch for txid: ${txid}, token id: ${JSON.stringify(id, bigIntReplacer)}`);
                tokenMismatchFound = true;
                mismatchFound = true;
            }
        };

        while (i < values1.length && j < values2.length) {
            const val1 = BigInt(values1[i]);
            const val2 = BigInt(values2[j]);

            if (val1 < val2) {
                logMismatchHeader();
                console.error(`  Extra value in new indexer: ${values1[i]}`);
                i++;
            } else if (val2 < val1) {
                logMismatchHeader();
                console.error(`  Extra value in prod indexer: ${values2[j]}`);
                j++;
            } else {
                i++;
                j++;
            }
        }

        while (i < values1.length) {
            logMismatchHeader();
            console.error(`  Extra value in new indexer: ${values1[i]}`);
            i++;
        }

        while (j < values2.length) {
            logMismatchHeader();
            console.error(`  Extra value in prod indexer: ${values2[j]}`);
            j++;
        }
    }

    for (const idStr of grouped2.keys()) {
        if (!grouped1.has(idStr)) {
            console.error(`Mismatch for txid: ${txid}. Token with id ${idStr} found in prod indexer but not in new.`);
            mismatchFound = true;
        }
    }
}
let addresses = [
    "bc1p5lushqjk7kxpqa87ppwn0dealucyqa6t40ppdkhpqm3grcpqvw9s3wdsx7", // frbtc
    "bc1phye26ay05egf9f8r2t842jf4q8t90n28d5f690fzltgls9xdr2fqy4jywd", // my personal
    "bc1pqq4hqs89cvjd75f6qlgtcpkfqlp9k4a5ctwplfzdxkfj7lvywszqd6r97s", // my oyl
    "bc1phqvgwn7wn5e4s8g0999rtgafd07jpuuy59rkdrk4s5thw9jafkasg8umr8", // ray's premine
    "bc1plvchrgqlw6e9g5t9v9ten687rt9pw2rjwqwaf9htgzmfup8jl2pqjrsaxj", // michael crypto
    "bc1pyxevp40ffke2ylcdvjd0aylc5wlgue04sew0wshudn2mhep4x85sv47mkt", // smolcap
    "bc1p0syk7kvy96uxuaev746l432lwpathz65c82rpxqwudy4j2r0pe7slhthr6", // jonothan
    "bc1p3eeh9ka8pkq27rgs3hwudywuw6erkvuvgcxejhrl2c4m0g28la2qkhyq28", // scott
    "bc1phz30v2ry8mfnf6d8hl9eyq2n3k3hu9a0uqyrnwl7lgvdj0qpu3uqdvenyv", // bongo
]

const readAddresses = () => new Promise((resolve, reject) => {
    const csvAddresses = [];
    fs.createReadStream('/Users/kevinyao/Downloads/diesel_drop_v15_export.csv')
        .pipe(parse({ from_line: 2 })) // Skip header row
        .on('data', (row) => {
            csvAddresses.push(row[0]);
        })
        .on('end', () => {
            resolve(csvAddresses);
        })
        .on('error', (error) => {
            reject(error);
        });
});

async function main() {
    // const addressesToProcess = addresses;
    // const addressesToProcess = await readAddresses();
    const addressesToProcess = espoData.result.items.map((it) => it.address);
    const startAddress = ""; // Replace with the actual address to start from
    let startIndex = addressesToProcess.indexOf(startAddress);
    if (startIndex === -1) {
        console.log("Start address not found, processing all addresses.");
        startIndex = 0;
    }

    for (let i = startIndex; i < addressesToProcess.length; i++) {
        const address = addressesToProcess[i];
        console.log("processing address ", address)
        const prod_balance = await prod_rpc.protorunesbyaddress({
            address,
            protocolTag: 1n,
        });

        const test_balance = await rpc.protorunesbyaddress({
            address,
            protocolTag: 1n,
        });
        compareTokenValues(test_balance.outpoints, prod_balance.outpoints)
    }
}

main().catch(console.error);

// const prod_balance_out = await signet_rpc.protorunesbyoutpoint({
//     txid: "D17DDF5186ADC1EA7D70F15D6D37B25540D6A90AD3A68E568072D31C1B21AD72",
//     vout: 3,
//     protocolTag: 1n,
// });

// console.log('Prod protorunes by out balance:', prod_balance_out);
