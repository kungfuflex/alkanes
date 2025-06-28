// Wallet balance utilities for sandshrew_balances method
// Utility functions for txid handling
export function reverseTxid(txid: string): string {
  if (!txid || txid.length !== 64) {
    throw new Error("Invalid txid format");
  }
  return Buffer.from(txid, "hex").reverse().toString("hex");
}

export function isTxidField(fieldName: string): boolean {
  return fieldName === "txid";
}

// Internal RPC call helper - uses the same executeRPC pattern as multicall
export async function executeInternalRPC(
  method: string,
  params: any[]
): Promise<any> {
  const requestId = Math.floor(Math.random() * 1000000);

  return new Promise((resolve, reject) => {
    const { executeRPC } = require("./execute");

    const mockReq = {
      body: {
        method,
        params,
        id: requestId,
        jsonrpc: "2.0",
      },
    };

    const mockRes = {
      json(response: any) {
        if (response.error) {
          reject(new Error(response.error.message || "RPC call failed"));
        } else {
          resolve(response.result);
        }
      },
    };

    executeRPC(mockReq, mockRes).catch((error) => {
      reject(error);
    });
  });
}

// Types for ord_blockheight and metashrew_height responses
export type OrdBlockHeight = number;
export type MetashewHeight = string;

// Types for ord outputs functionality
export interface OrdRune {
  amount: number;
  divisibility: number;
  symbol: string;
}

export interface OrdOutput {
  address: string;
  confirmations: number;
  indexed: boolean;
  inscriptions: string[];
  outpoint: string;
  runes: Record<string, OrdRune>;
  sat_ranges: number[][];
  script_pubkey: string;
  spent: boolean;
  transaction: string;
  value: number;
}

// Types for balance functionality
export interface UTXO {
  outpoint: string;
  value: number;
  height?: number;
  runes?: any[];
  inscriptions?: string[];
  ord_runes?: Record<string, OrdRune>;
}

export interface RuneOutpoint {
  outpoint: {
    txid: string;
    vout: number;
  };
  runes: any[];
}

export interface ProtorunesResponse {
  outpoints?: RuneOutpoint[];
}

export interface AddressInfo {
  spendable: UTXO[];
  assets: UTXO[];
  pending: UTXO[];
  ordHeight: number;
  metashrewHeight: number;
}

export interface BalanceRequest {
  address: string;
  protocolTag?: string;
  assetAddress?: string;
}

/**
 * Execute multiple RPC calls in parallel using the internal system
 */
async function executeMultipleRPC(
  requests: Array<{ method: string; params: any[] }>
): Promise<any[]> {
  const promises = requests.map((req) => {
    return executeInternalRPC(req.method, req.params)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  });

  try {
    const results = await Promise.all(promises);

    return results;
  } catch (error) {
    throw error;
  }
}

/**
 * Process raw results into structured address information
 */
function processAddressInfo(
  utxosJson: UTXO[],
  protorunesJson: ProtorunesResponse,
  ordOutputsJson: OrdOutput[],
  ordHeight: number,
  metashrewHeight: number
): AddressInfo {
  // Create runes map from protorunes
  const runesMap = new Map<string, any[]>();
  if (protorunesJson && protorunesJson.outpoints) {
    for (const runeOutpoint of protorunesJson.outpoints) {
      const txid = reverseTxid(runeOutpoint.outpoint.txid);
      const key = `${txid}:${runeOutpoint.outpoint.vout}`;
      runesMap.set(key, runeOutpoint.runes);
    }
  }

  // Create ord outputs map for inscriptions and ord runes
  const ordOutputsMap = new Map<
    string,
    { inscriptions: string[]; ord_runes: Record<string, OrdRune> }
  >();
  if (ordOutputsJson) {
    for (const ordOutput of ordOutputsJson) {
      // Parse outpoint to get txid and vout
      const [txid, vout] = ordOutput.outpoint.split(":");
      const key = `${txid}:${vout}`;
      ordOutputsMap.set(key, {
        inscriptions: ordOutput.inscriptions || [],
        ord_runes: ordOutput.runes || {},
      });
    }
  }

  // Get the maximum height between ord and metashrew for indexing cutoff
  const maxIndexedHeight = Math.max(ordHeight, metashrewHeight);

  // Process UTXOs into three categories
  const spendableUtxos: UTXO[] = [];
  const assetUtxos: UTXO[] = [];
  const pendingUtxos: UTXO[] = [];

  (utxosJson || []).forEach((utxo: any) => {
    const key = `${utxo.txid}:${utxo.vout}`;
    const runes = runesMap.get(key);
    const ordData = ordOutputsMap.get(key);

    // Build optimized UTXO structure
    const optimizedUtxo: UTXO = {
      outpoint: key,
      value: utxo.value,
    };

    // Only add height if block exists
    if (utxo.status?.block_height) {
      optimizedUtxo.height = utxo.status.block_height;
    }

    // Only add runes if they exist
    if (runes && runes.length > 0) {
      optimizedUtxo.runes = runes;
    }

    // Only add inscriptions if they exist
    if (ordData?.inscriptions && ordData.inscriptions.length > 0) {
      optimizedUtxo.inscriptions = ordData.inscriptions;
    }

    // Only add ord_runes if they exist
    if (ordData?.ord_runes && Object.keys(ordData.ord_runes).length > 0) {
      optimizedUtxo.ord_runes = ordData.ord_runes;
    }

    // Categorize UTXO
    const hasAssets =
      (runes && runes.length > 0) ||
      (ordData?.inscriptions && ordData.inscriptions.length > 0) ||
      (ordData?.ord_runes && Object.keys(ordData.ord_runes).length > 0);

    // Check if UTXO is pending (after max indexed height)
    const utxoHeight = utxo.status?.block_height;
    const isPending = utxoHeight && utxoHeight > maxIndexedHeight;

    if (isPending) {
      pendingUtxos.push(optimizedUtxo);
    } else if (hasAssets) {
      assetUtxos.push(optimizedUtxo);
    } else {
      spendableUtxos.push(optimizedUtxo);
    }
  });

  // Sort all UTXO arrays from oldest to newest (by block height)
  // Unconfirmed transactions (no block_height) come last
  const sortUtxos = (utxos: UTXO[]) => {
    return utxos.sort((a, b) => {
      const aHeight = a.height;
      const bHeight = b.height;

      // If both are unconfirmed, maintain original order
      if (!aHeight && !bHeight) return 0;

      // Unconfirmed transactions go to the end
      if (!aHeight) return 1;
      if (!bHeight) return -1;

      // Sort by block height (oldest first = lower block height first)
      return aHeight - bHeight;
    });
  };

  return {
    spendable: sortUtxos(spendableUtxos),
    assets: sortUtxos(assetUtxos),
    pending: sortUtxos(pendingUtxos),
    ordHeight,
    metashrewHeight,
  };
}

/**
 * Get comprehensive address information including UTXOs, block count, protorunes, and ord outputs
 * Uses internal RPC calls for efficient data fetching
 * If assetAddress is provided, fetches data for both addresses and combines the results
 */
export async function getAddressInfo(
  request: BalanceRequest
): Promise<AddressInfo> {
  const { address, protocolTag = "1", assetAddress } = request;

  const addresses = [address, assetAddress].filter(Boolean);
  const uniqueAddresses = [...new Set(addresses)]; // Remove duplicates

  const rpcCalls: Array<{ method: string; params: any[] }> = [];

  // Add requests for each unique address
  for (const addr of uniqueAddresses) {
    rpcCalls.push({
      method: "esplora_address::utxo",
      params: [addr],
    });

    rpcCalls.push({
      method: "alkanes_protorunesbyaddress",
      params: [{ address: addr, protocolTag }],
    });

    rpcCalls.push({
      method: "ord_outputs",
      params: [addr],
    });
  }

  // Add shared requests: ord blockheight and metashrew height
  rpcCalls.push({
    method: "ord_blockheight",
    params: [],
  });

  rpcCalls.push({
    method: "metashrew_height",
    params: [],
  });

  console.log(rpcCalls);

  try {
    const results = await executeMultipleRPC(rpcCalls);

    if (results.length !== uniqueAddresses.length * 3 + 2) {
      const errorMsg = `Unexpected number of results from parallel RPC calls. Expected: ${uniqueAddresses.length * 3 + 2}, Got: ${results.length}`;
      console.log(errorMsg);
      throw new Error(errorMsg);
    }

    // The last 2 results are ord blockheight and metashrew height
    const ordBlockHeight = results[results.length - 2] as OrdBlockHeight;
    const metashrewHeight = parseInt(
      results[results.length - 1] as MetashewHeight
    );

    // If only one address, process normally
    if (uniqueAddresses.length === 1) {
      const [utxosResult, protorunesResult, ordOutputsResult] = results;

      const addressInfo = processAddressInfo(
        utxosResult,
        protorunesResult,
        ordOutputsResult,
        ordBlockHeight,
        metashrewHeight
      );

      return addressInfo;
    }

    // For multiple addresses, combine all UTXOs
    const allSpendableUtxos = [];
    const allAssetUtxos = [];
    const allPendingUtxos = [];

    for (let i = 0; i < uniqueAddresses.length; i++) {
      const currentAddress = uniqueAddresses[i];
      const utxosResult = results[i * 3];
      const protorunesResult = results[i * 3 + 1];
      const ordOutputsResult = results[i * 3 + 2];

      const addressInfo = processAddressInfo(
        utxosResult,
        protorunesResult,
        ordOutputsResult,
        ordBlockHeight,
        metashrewHeight
      );

      allSpendableUtxos.push(...addressInfo.spendable);
      allAssetUtxos.push(...addressInfo.assets);
      allPendingUtxos.push(...addressInfo.pending);
    }

    return {
      spendable: allSpendableUtxos,
      assets: allAssetUtxos,
      pending: allPendingUtxos,
      ordHeight: ordBlockHeight,
      metashrewHeight,
    };
  } catch (error) {
    throw error;
  }
}
