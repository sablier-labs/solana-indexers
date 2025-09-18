import { SolanaInstruction } from "@subql/types-solana";
import {
  chainCode,
  chainId,
  cluster,
  substream,
  lockupLinear
} from "../generated/env";

export let zero = BigInt(0);
export let one = BigInt(1);
export let two = BigInt(2);
export let d18 = BigInt(18);

export let StreamVersion_V10 = "V10";
export let AirdropVersion_V10 = "V10";

export function getContractsLockupLinear(): string[][] {
  if (lockupLinear.length === 0) {
    return [];
  }
  return lockupLinear.map<string[]>(item => [
    item[0].toString(),
    item[1].toString().toUpperCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V10
  ]);
}

export function getChainId(): bigint {
  return BigInt(chainId);
}

export function getChainCode(): string {
  return chainCode;
}

export function getCluster(): string {
  return cluster;
}

export function getSubstreamCluster(): string {
  return substream;
}

export function log_error(
  message: string,
  instruction?: SolanaInstruction
): void {
  if (!instruction) {
    logger.error(`Sablier Logger: ${message}`);
  } else {
    logger.error(
      `Sablier Logger [TX ${instruction.transaction.transaction.signatures[0]}]: ${message}`
    );
  }
}

export function log_info(message: string): void {
  logger.error(`Sablier Logger: ${message}`);
}

export {
  chainGenesis,
  cluster,
  rpc,
  startBlock_lockup,
  lockupLinear,
  tokenProgram
} from "../generated/env";
