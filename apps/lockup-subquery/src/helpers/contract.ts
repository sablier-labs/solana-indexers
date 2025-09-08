import { Contract, ContractCategory } from "../types";
import {
  getChainCode,
  getChainId,
  getCluster,
  getContractsLockupLinear,
  zero
} from "../constants";

export async function getContractByAddress(
  address: string
): Promise<Contract | undefined> {
  return Contract.get(generateContractId(address));
}

export async function getContractById(
  id: string
): Promise<Contract | undefined> {
  return Contract.get(id);
}

export async function getOrCreateContract(address: string): Promise<Contract> {
  const id = generateContractId(address);
  const found = await getContractByAddress(address);

  if (found) {
    return found;
  }

  /** Check if the contract is a Lockup Linear */

  const contracts = getContractsLockupLinear();
  const index = _findContractIndex(contracts, address);
  if (index == -1) {
    throw new Error(
      `Missing contract ${address} from configuration ${contracts
        .map<string>(item => item[0])
        .join(",")}`
    );
  }

  const definition = contracts[index];

  const entity = Contract.create({
    id,
    address,
    alias: definition[1],
    category: ContractCategory.LockupLinear,

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

export function generateContractId(address: string): string {
  const chainCode = getChainCode();

  return ""
    .concat(address)
    .concat("-")
    .concat(chainCode);
}

function _findContractIndex(haystack: string[][], needle: string) {
  let index = -1;
  for (let i = 0; i < haystack.length; i++) {
    if (haystack[i][0] == needle) {
      index = i;
      break;
    }
  }
  return index;
}
