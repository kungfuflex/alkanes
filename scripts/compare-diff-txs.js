const fs = require('fs');
var { AlkanesRpc } = require("../lib/rpc.js");
const readline = require('readline');
const { forEach } = require('lodash');
const axios = require('axios');

const rpc = new AlkanesRpc({ baseUrl: 'https://filler-season-apathy.sandshrew.io:8443' });
const prod_rpc = new AlkanesRpc({ baseUrl: 'https://mainnet.sandshrew.io/v2/d6aebfed1769128379aca7d215f0b689' });
const filePath = '/home/ubuntu/txid-diff.txt';
// const filePath = '/home/ubuntu/txid-diff-btree.txt';
// const filePath = '/home/ubuntu/txid-diff-reorg.txt';

// run with `node scripts/compare-diff-txs.js 1>log.txt 2> >(tee error.txt)`
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Function to compare two lists
const bigIntReplacer = (key, value) =>
    typeof value === 'bigint' ? value.toString() : value;

function compareTokenValues(list1, list2, txid) {
    if (list1.length === 0 && list2.length === 0) {
        console.log(`${txid}: No balances found, possibly on another outpoint`);
        return;
    }

    const groupAndSort = (list) => {
        const grouped = new Map();
        for (const item of list) {
            const id = JSON.stringify(item.token.id, bigIntReplacer);
            if (!grouped.has(id)) {
                grouped.set(id, []);
            }
            grouped.get(id).push(item.value);
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
            console.error(`Mismatch for txid: ${txid}. Token with id ${idStr} found in new indexer but not in prod.`);
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
async function processLine(line) {
    // console.log(`processing ${line}`);
    try {
        const reversedTxid = Buffer.from(line, 'hex').reverse().toString('hex');
        let isSpent = false;
        try {
            const { data } = await axios.get(`https://blockstream.info/api/tx/${reversedTxid}/outspend/0`);
            if (data.spent) {
                isSpent = true;
            }
        } catch (e) {
            if (e.response && e.response.status !== 404) {
                console.error(`Error checking outpoint for ${line}:`, e.message);
                return;
            }
        }

        if (isSpent) {
            console.log(`Skipping spent outpoint: ${line}`);
            return;
        }

        const balance = await rpc.protorunesbyoutpoint({
            txid: line,
            vout: 0,
            protocolTag: 1n,
        });
        const prod_balance = await prod_rpc.protorunesbyoutpoint({
            txid: line,
            vout: 0,
            protocolTag: 1n,
        });
        compareTokenValues(balance, prod_balance, line);
        await sleep(5);
    } catch (err) {
        console.error(`Error processing line ${line}:`, err.message);
    }
}

// Function to process the file line-by-line
async function processFile() {
    return new Promise((resolve, reject) => {
        // Create a read stream for the file
        const readStream = fs.createReadStream(filePath, 'utf8');

        // Create a readline interface
        const rl = readline.createInterface({
            input: readStream,
            output: process.stdout,
            terminal: false
        });

        // Use a for-await loop to process each line sequentially
        (async () => {
            try {
                for await (const line of rl) {
                    // Call the async function to process each line
                    await processLine(line);
                }
                console.log('File processing completed.');
                resolve(); // Resolve once all lines have been processed
            } catch (err) {
                reject(err); // Reject if there's an error
            }
        })();
    });
}
// Call the async function and use await
async function main() {
    console.error(`test`)
    try {
        await processFile(); // Wait for the file processing to complete
    } catch (err) {
        console.error('Error processing file:', err);
    }
}

main(); // Run the script
