import { BigInt } from "@graphprotocol/graph-ts";
import { Stream, Contract } from "../../generated/schema";
import { getChainId, one, zero } from "../constants";
import { getOrCreateContract } from "./contract";
import { getOrCreateWatcher } from "./watcher";
import { getOrCreateAsset } from "./asset";
import { EventCreateWithTimestamps, ProtoData } from "../adapters";

function createStream(
  tokenId: BigInt,
  program: string,
  instruction: BigInt,
  hash: string,
  timestamp: BigInt
): Stream | null {
  let watcher = getOrCreateWatcher();

  /** --------------- */
  let contract = getOrCreateContract(program);

  /** --------------- */
  let id = generateStreamId(tokenId, program);
  if (id == null) {
    return null;
  }

  let alias = generateStreamAlias(tokenId, contract);

  /** --------------- */
  let entity = new Stream(id);
  /** --------------- */

  entity.contract = contract.id;
  entity.hash = hash;
  entity.instruction = instruction;
  entity.timestamp = timestamp;

  entity.chainId = watcher.chainId;
  entity.cluster = watcher.cluster;

  entity.tokenId = tokenId;
  entity.alias = alias;
  entity.contract = contract.id;
  entity.version = contract.version;
  entity.subgraphId = watcher.streamIndex;

  /** --------------- */
  entity.cliff = false;
  entity.initial = false;
  entity.canceled = false;
  entity.renounceAction = null;
  entity.canceledAction = null;
  entity.initialAmount = null;
  entity.cliffAmount = null;
  entity.cliffTime = null;
  entity.transferable = true; // All streams are transferable by default
  entity.withdrawnAmount = zero;

  /** --------------- */
  watcher.streamIndex = watcher.streamIndex.plus(one);
  watcher.save();

  /** --------------- */

  return entity;
}

export function createLinearStream(
  event: EventCreateWithTimestamps,
  system: ProtoData
): Stream | null {
  let tokenId = BigInt.fromI64(system.blockTimestamp); // TODO: replace with actual stream id after NFTs get implemented
  let entity = createStream(
    tokenId,
    event.instructionProgram,
    BigInt.fromU64(event.instructionIndex),
    event.transactionHash,
    BigInt.fromI64(system.blockTimestamp)
  );

  if (entity == null) {
    return null;
  }

  /** --------------- */
  entity.category = "LockupLinear";
  entity.sender = event.sender;
  entity.senderAta = event.senderAta;
  entity.recipient = event.recipient;
  entity.recipientAta = event.recipientAta;

  entity.parties = [event.sender, event.recipient];

  entity.depositAmount = BigInt.fromU64(event.depositedAmount);
  entity.intactAmount = BigInt.fromU64(event.depositedAmount);

  entity.startTime = BigInt.fromU64(event.startTime);
  entity.endTime = BigInt.fromU64(event.endTime);
  entity.cancelable = !!event.cancelable;

  /** --------------- */
  let duration = BigInt.fromU64(event.endTime).minus(
    BigInt.fromU64(event.startTime)
  );

  /** --------------- */
  let cliffTime = BigInt.fromU64(event.cliffTime);

  if (!cliffTime.isZero()) {
    entity.cliff = true;
    entity.cliffAmount = zero; // TODO: actual cliff amount when unlocks PR is merged
    entity.cliffTime = cliffTime;
  } else {
    entity.cliff = false;
  }

  entity.duration = duration;

  /** --------------- */
  let asset = getOrCreateAsset(event.tokenMint, event.tokenProgram);
  entity.asset = asset.id;

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateStreamId(tokenId: BigInt, program: string): string {
  const chainId = getChainId();

  let id = ""
    .concat(program)
    .concat("-")
    .concat(chainId.toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}

export function generateStreamAlias(
  tokenId: BigInt,
  contract: Contract
): string {
  let alias = ""
    .concat(contract.alias)
    .concat("-")
    .concat(contract.chainId.toString())
    .concat("-")
    .concat(tokenId.toString());

  return alias;
}

export function getStreamById(tokenId: BigInt, program: string): Stream | null {
  let id = generateStreamId(tokenId, program);
  return Stream.load(id);
}
