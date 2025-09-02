import {
  chainCode,
  chainId,
  cluster,
  substream,
  lockupLinear,
  merkleInstant
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

export function getContractsMerkleInstant(): string[][] {
  if (merkleInstant.length === 0) {
    return [];
  }
  return merkleInstant.map<string[]>(item => [
    item[0].toString(),
    item[1].toString().toUpperCase(),
    item.length >= 3 ? item[2].toString() : AirdropVersion_V10
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

export function log_exit(message: string, dependencies: string[] = []): void {
  logger.error(`Sablier Logger: ${message}`, dependencies);
}

export function log_debug(message: string, dependencies: string[] = []): void {
  logger.debug(`Sablier Logger: ${message}`, dependencies);
}
