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
  } else return entity;

  /** Check if the contract is a Lockup Linear */

  let linear = getContractsLinear();
  let index = linear.findIndex((entry) => entry[0] === address);
  if (index == null) {
    throw new Error("Missing contract from configuration");
  }

  const definition = linear[index];

  entity.alias = linear[index][1];
  entity.address = address;
  entity.chainId = chainId;
  entity.cluster = cluster;
  entity.category = "LockupLinear";
  entity.version = linear[index][2];

  entity.save();
  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateContractId(address: string, chainId: BigInt): string {
  return "".concat(address);
}
