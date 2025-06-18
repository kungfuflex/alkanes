import { Client } from "./lib/client";
import { RANDOM_ADDRESS, REGTEST_FAUCET } from "./lib/constants";

// Create a client to interact with the Bitcoin node
const client = new Client("regtest");

// Use a valid address from constants
const validAddress = REGTEST_FAUCET.nativeSegwit.address;

// Simple timeout function
const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function waitForSync(maxAttempts = 60): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const btcHeight = Number((await client.call("getblockcount")).data.result);
      const msHeight = Number((await client.call("metashrew_height", [])).data.result);
      console.log(`btc: ${btcHeight} | metashrew: ${msHeight}`);
      
      if (msHeight >= btcHeight) {
        return;
      }
      
      await timeout(1000); // 1 second delay between attempts
    } catch (error) {
      console.error(`Error checking sync status: ${error.message}`);
      // Continue trying despite errors
    }
  }
  
  throw new Error("Timeout waiting for Metashrew to sync with Bitcoin height");
}

async function testReorg(): Promise<void> {
  try {
    console.log("Starting reorg test");

    // Generate some initial blocks
    console.log("Attempting to generate initial blocks...");
    console.log(`Using address: ${validAddress}`);
    const initialBlocksResponse = await client.call("generatetoaddress", 10, validAddress);
    console.log("Raw response:", JSON.stringify(initialBlocksResponse));
    
    if (!initialBlocksResponse || !initialBlocksResponse.data || !initialBlocksResponse.data.result) {
      throw new Error("Failed to generate initial blocks: Invalid response");
    }
    
    console.log(`Generated ${initialBlocksResponse.data.result.length} initial blocks`);
    
    // Wait for metashrew to sync
    await waitForSync();
    
    // Get the current block count
    const blockCount = (await client.call("getblockcount")).data.result;
    console.log(`Current block count: ${blockCount}`);
    
    // Get the block hash at height blockCount - 3 (we'll reorg from this point)
    const reorgHeight = blockCount - 3;
    const reorgBlockHash = (await client.call("getblockhash", reorgHeight)).data.result;
    console.log(`Will reorg from block at height ${reorgHeight} with hash ${reorgBlockHash}`);
    
    // Get the block data before reorg
    const blockBeforeReorg = await client.call("getblock", reorgBlockHash, 2);
    console.log(`Block before reorg: ${JSON.stringify(blockBeforeReorg.data.result.hash)}`);
    
    // Store the block hash from metashrew before reorg
    const blockHashBeforeReorg = (await client.call("getblockhash", reorgHeight)).data.result;
    console.log(`Block hash from metashrew before reorg: ${blockHashBeforeReorg}`);
    
    // Perform the reorg
    console.log("Performing reorg...");
    const reorgResult = await client.call("reorg", 3, validAddress, 5);
    console.log(`Reorg result: ${JSON.stringify(reorgResult.data.result)}`);
    
    // Wait for metashrew to sync after reorg
    await waitForSync();
    
    // Get the new block hash at the same height
    const newBlockHash = (await client.call("getblockhash", reorgHeight)).data.result;
    console.log(`New block at height ${reorgHeight} has hash ${newBlockHash}`);
    
    // Get the block data after reorg
    const blockAfterReorg = await client.call("getblock", newBlockHash, 2);
    console.log(`Block after reorg: ${JSON.stringify(blockAfterReorg.data.result.hash)}`);
    
    // Store the block hash from metashrew after reorg
    const blockHashAfterReorg = (await client.call("getblockhash", reorgHeight)).data.result;
    console.log(`Block hash from metashrew after reorg: ${blockHashAfterReorg}`);
    
    // Verify that the blocks are different
    if (reorgBlockHash !== newBlockHash) {
      console.log("Reorg successful! Block hashes are different.");
      
      // Verify that metashrew has updated its data
      if (blockHashBeforeReorg !== blockHashAfterReorg) {
        console.log("Metashrew has successfully detected and processed the reorg!");
      } else {
        console.error("Metashrew did not update its data after the reorg!");
      }
    } else {
      console.error("Reorg failed! Block hashes are the same.");
    }
    
    console.log("Reorg test completed");
  } catch (error) {
    console.error(`Error during reorg test: ${error.message}`);
    throw error;
  }
}

// Run the test
(async () => {
  try {
    await testReorg();
  } catch (error) {
    console.error("Test failed:", error);
  }
})();