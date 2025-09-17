import { Factory } from "../types";
import {
  getChainCode,
  getChainId,
  getCluster,
  getContractsMerkleInstant,
  zero
} from "../constants";

export async function getFactoryByAddress(
  address: string
): Promise<Factory | undefined> {
  return Factory.get(generateFactoryId(address));
}

export async function getFactoryById(id: string): Promise<Factory | undefined> {
  return Factory.get(id);
}

export async function getOrCreateFactory(address: string): Promise<Factory> {
  const id = generateFactoryId(address);
  const found = await getFactoryByAddress(address);

  if (found) {
    return found;
  }

  /** Check if the contract is a Merkle Instant */

  const contracts = getContractsMerkleInstant();
  const index = _findFactoryIndex(contracts, address);
  if (index == -1) {
    throw new Error(
      `Missing contract ${address} from configuration ${contracts
        .map<string>(item => item[0])
        .join(",")}`
    );
  }

  const definition = contracts[index];

  const entity = Factory.create({
    id,
    address,
    alias: definition[1],
    campaignIndex: zero,

    chainCode: getChainCode(),
    chainId: getChainId(),
    cluster: getCluster(),

    version: definition[2]
  });

  await entity.save();

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateFactoryId(address: string): string {
  const chainCode = getChainCode();

  return ""
    .concat(address)
    .concat("-")
    .concat(chainCode);
}

function _findFactoryIndex(haystack: string[][], needle: string) {
  let index = -1;
  for (let i = 0; i < haystack.length; i++) {
    if (haystack[i][0] == needle) {
      index = i;
      break;
    }
  }
  return index;
}
