const fs = require('fs');
const readline = require('readline');
const { forEach } = require('lodash');

// Replace 'yourfile.txt' with the path to your text file
const filePath = '/tmp/rockshrew-diff-output.txt';

// The substring to search for
const searchSubstring = '0x2F72756E65732F70726F746F2F312F62796F7574706F696E742F';

// Create a Set to store unique substrings
const extractedSubstrings = new Set();

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


        // Listen for each line of the file
        rl.on('line', (line) => {
            const index = line.indexOf(searchSubstring);
            if (index !== -1) {
                // Grab the next 62 characters after the found substring
                const substring = line.slice(index + searchSubstring.length, index + searchSubstring.length + 64);

                // Add the substring to the Set (duplicates will be ignored)
                extractedSubstrings.add(substring);
            }
        });

        rl.on('close', () => {
            console.log('File processing completed.');

            // Convert the Set to an array and write to a text file
            const outputFilePath = '~/txid-diff.txt';
            const uniqueSubstringsArray = [...extractedSubstrings];

            // Write the unique substrings to the file
            fs.writeFile(outputFilePath, uniqueSubstringsArray.join('\n'), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    return;
                }
                console.log(`Unique substrings have been written to ${outputFilePath}`);
            });

            resolve(); // Resolves the promise when file processing is finished
        });

        rl.on('error', (err) => {
            reject(err); // Reject the promise if there's an error
        });
    });
}

// Call the async function and use await
async function main() {
    try {
        await processFile(); // Wait for the file processing to complete

    } catch (err) {
        console.error('Error processing file:', err);
    }
}

main(); // Run the script