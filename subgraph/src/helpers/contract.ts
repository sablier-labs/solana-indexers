import { BigInt } from "@graphprotocol/graph-ts";
import { Contract } from "../../generated/schema";
import { getChainId, getCluster, getContractsLinear } from "../constants";

export function getContractByAddress(
  address: string,
  chainId: BigInt
): Contract | null {
  return Contract.load(generateContractId(address, chainId));
}

export function getOrCreateContract(address: string): Contract {
  let chainId = getChainId();
  let cluster = getCluster();

  let id = generateContractId(address, chainId);
  let entity = getContractByAddress(address, chainId);

  if (entity == null) {
    entity = new Contract(id);
  } else {
    return entity;
  }

  /** Check if the contract is a Lockup Linear */

  let linear = getContractsLinear();
  let index = _findContractIndex(linear, address);
  if (index == -1) {
    throw new Error(
      `Missing contract ${address} from configuration ${linear
        .map<string>((item) => item[0])
        .join(",")}`
    );
  }

  const definition = linear[index];

  entity.alias = definition[1];
  entity.address = address;
  entity.chainId = chainId;
  entity.cluster = cluster;
  entity.category = "LockupLinear";
  entity.version = definition[2];

  entity.save();
  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateContractId(address: string, chainId: BigInt): string {
  return ""
    .concat(address)
    .concat("-")
    .concat(chainId.toString());
}

function _findContractIndex(haystack: string[][], needle: string): i32 {
  let index: i32 = -1;
  for (let i = 0; i < haystack.length; i++) {
    if (haystack[i][0] == needle) {
      index = i;
      break;
    }
  }
  return index;
}
