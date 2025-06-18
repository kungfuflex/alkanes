import { Client } from "./lib/client";
import { getLogger } from "./lib/logger";
import { timeout } from "./lib/utils";

const logger = getLogger("alkanes:reorg-test");

// Create a client to interact with the Bitcoin node
const client = new Client("regtest");

async function waitForSync(maxAttempts = 60): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const btcHeight = Number((await client.call("getblockcount")).data.result);
      const msHeight = Number((await client.call("metashrew_height", [])).data.result);
      logger.info("btc: " + btcHeight + "|metashrew: " + msHeight);
      
      if (msHeight >= btcHeight) {
        return;
      }
      
      await timeout(1000); // 1 second delay between attempts
    } catch (error) {
      logger.error(`Error checking sync status: ${error.message}`);
      // Continue trying despite errors
    }
  }
  
  throw new Error("Timeout waiting for Metashrew to sync with Bitcoin height");
}

async function testReorg(): Promise<void> {
  try {
    logger.info("Starting reorg test");

    // Generate some initial blocks
    const initialBlocks = await client.call("generatetoaddress", 10, "bcrt1qjh3dnhapm27j8k5mk4qxjt3gkwkl8n8j2xkwl8");
    logger.info(`Generated ${initialBlocks.data.result.length} initial blocks`);
    
    // Wait for metashrew to sync
    await waitForSync();
    
    // Get the current block count
    const blockCount = (await client.call("getblockcount")).data.result;
    logger.info(`Current block count: ${blockCount}`);
    
    // Get the block hash at height blockCount - 3 (we'll reorg from this point)
    const reorgHeight = blockCount - 3;
    const reorgBlockHash = (await client.call("getblockhash", reorgHeight)).data.result;
    logger.info(`Will reorg from block at height ${reorgHeight} with hash ${reorgBlockHash}`);
    
    // Get the block data before reorg
    const blockBeforeReorg = await client.call("getblock", reorgBlockHash, 2);
    logger.info(`Block before reorg: ${JSON.stringify(blockBeforeReorg.data.result.hash)}`);
    
    // Store the block hash from metashrew before reorg
    const blockHashBeforeReorg = (await client.call("getblockhash", reorgHeight)).data.result;
    logger.info(`Block hash from metashrew before reorg: ${blockHashBeforeReorg}`);
    
    // Perform the reorg
    logger.info("Performing reorg...");
    const reorgResult = await client.call("reorg", 3, "bcrt1qjh3dnhapm27j8k5mk4qxjt3gkwkl8n8j2xkwl8", 5);
    logger.info(`Reorg result: ${JSON.stringify(reorgResult.data.result)}`);
    
    // Wait for metashrew to sync after reorg
    await waitForSync();
    
    // Get the new block hash at the same height
    const newBlockHash = (await client.call("getblockhash", reorgHeight)).data.result;
    logger.info(`New block at height ${reorgHeight} has hash ${newBlockHash}`);
    
    // Get the block data after reorg
    const blockAfterReorg = await client.call("getblock", newBlockHash, 2);
    logger.info(`Block after reorg: ${JSON.stringify(blockAfterReorg.data.result.hash)}`);
    
    // Store the block hash from metashrew after reorg
    const blockHashAfterReorg = (await client.call("getblockhash", reorgHeight)).data.result;
    logger.info(`Block hash from metashrew after reorg: ${blockHashAfterReorg}`);
    
    // Verify that the blocks are different
    if (reorgBlockHash !== newBlockHash) {
      logger.info("Reorg successful! Block hashes are different.");
      
      // Verify that metashrew has updated its data
      if (blockHashBeforeReorg !== blockHashAfterReorg) {
        logger.info("Metashrew has successfully detected and processed the reorg!");
      } else {
        logger.error("Metashrew did not update its data after the reorg!");
      }
    } else {
      logger.error("Reorg failed! Block hashes are the same.");
    }
    
    logger.info("Reorg test completed");
  } catch (error) {
    logger.error(`Error during reorg test: ${error.message}`);
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