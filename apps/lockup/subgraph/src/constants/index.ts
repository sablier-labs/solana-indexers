import { BigInt } from "@graphprotocol/graph-ts";

import {
  chainCode,
  chainId,
  cluster,
  substream,
  lockupLinear
} from "../../generated/env";

export let zero = BigInt.fromI32(0);
export let one = BigInt.fromI32(1);
export let two = BigInt.fromI32(2);
export let d18 = BigInt.fromI32(18);

export let StreamVersion_V10 = "V10";

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

export function getChainId(): BigInt {
  return BigInt.fromI32(chainId);
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
