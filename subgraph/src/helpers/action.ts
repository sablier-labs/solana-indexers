import { BigInt, dataSource, log } from "@graphprotocol/graph-ts";
import { Action } from "../../generated/schema";
import { getChainId, getCluster, one, zero } from "../constants";
import { getOrCreateContract } from "./contract";
import { getOrCreateWatcher } from "./watcher";

export function getActionById(id: string): Action | null {
  return Action.load(id);
}

export function createAction(
  program: string,
  hash: string,
  timestamp: number,
  block: number
): Action {
  let watcher = getOrCreateWatcher();
  let id = generateActionId(hash, watcher.chainId);
  let entity = new Action(id);

  entity.block = BigInt.fromI32(block);
  entity.hash = hash;
  entity.timestamp = BigInt.fromI32(timestamp);
  entity.subgraphId = watcher.actionIndex;
  entity.chainId = getChainId();
  entity.fee = zero; // TODO: Implement fees

  /** --------------- */
  let contract = getOrCreateContract(program);
  if (contract == null) {
    log.debug("[SABLIER] Contract hasn't been successfully registered {}", [
      dataSource.address().toHexString(),
    ]);
    log.error("[SABLIER]", []);
  } else {
    entity.contract = contract.id;
  }

  /** --------------- */
  watcher.actionIndex = watcher.actionIndex.plus(one);
  watcher.save();

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateActionId(hash: string, chainId: BigInt): string {
  return ""
    .concat(hash)
    .concat("-")
    .concat(chainId.toString());
}
