const fs = require('fs');
var { AlkanesRpc } = require("../lib/rpc.js");
const readline = require('readline');
const { forEach } = require('lodash');

const rpc = new AlkanesRpc({ baseUrl: 'http://localhost:8090' });
const prod_rpc = new AlkanesRpc({ baseUrl: 'https://mainnet.sandshrew.io/v2/lasereyes' });
const filePath = '/home/ubuntu/txid-diff.txt';
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Function to compare two lists
function compareTokenValues(list1, list2, txid) {
    // Create a map for list1, using token name or symbol as key
    const list1Map = new Map(list1.map(item => [item.token.name || item.token.symbol, item.value]));
    if (list1.length == 0 && list2.length == 0) {
        console.log("No balances found, possibly on another outpoint")
    }
    // console.log(list1);
    // console.log(list2);
    // Iterate over list2 and compare values
    list2.forEach(item => {
        const key = item.token.name || item.token.symbol;
        if (list1Map.has(key)) {
            if (list1Map.get(key) !== item.value) {
                console.log(`Mismatch found for token: ${key}`);
                console.log(`Value in list1: ${list1Map.get(key)} | Value in list2: ${item.value}`);
                if (item.value > list1Map.get(key)) {
                    console.error(`OLD INDEXER (${item.value}) HAS MORE THAN NEW INDEXER (${list1Map.get(key)}): ${txid}`)
                }
            }
        } else {
            console.log(`Token ${key} found in list2 but not in list1.`);
        }
    });

    // Check if any tokens from list1 are missing in list2
    list1.forEach(item => {
        const key = item.token.name || item.token.symbol;
        if (!list2.some(item2 => item2.token.name === key || item2.token.symbol === key)) {
            console.log(`Token ${key} found in list1 but not in list2.`);
        }
    });
}
async function processLine(line) {
    console.log(`processing ${line}`);
    try {
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
        console.error('Error processing line:', err);
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
