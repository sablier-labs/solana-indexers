import { BigInt, log } from "@graphprotocol/graph-ts";
import { Action } from "../../generated/schema";
import { one, zero } from "../constants";
import { getOrCreateContract } from "./contract";
import { getOrCreateWatcher } from "./watcher";

export function getActionById(id: string): Action | null {
  return Action.load(id);
}

export function createAction(
  program: string,
  hash: string,
  timestamp: BigInt,
  block: BigInt,
  instruction: BigInt
): Action {
  let watcher = getOrCreateWatcher();
  let id = generateActionId(hash, watcher.chainId, instruction);
  let entity = new Action(id);

  entity.block = block;
  entity.hash = hash;
  entity.timestamp = timestamp;

  entity.chainId = watcher.chainId;
  entity.cluster = watcher.cluster;

  entity.subgraphId = watcher.actionIndex;
  entity.fee = zero; // TODO: Implement fees

  /** --------------- */
  let contract = getOrCreateContract(program);
  entity.contract = contract.id;

  /** --------------- */
  watcher.actionIndex = watcher.actionIndex.plus(one);
  watcher.save();

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateActionId(
  hash: string,
  chainId: BigInt,
  instruction: BigInt
): string {
  return ""
    .concat(chainId.toString())
    .concat("-")
    .concat(hash)
    .concat("-")
    .concat(instruction.toString());
}
