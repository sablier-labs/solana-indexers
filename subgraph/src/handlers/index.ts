import { BigInt, log } from "@graphprotocol/graph-ts";
import { Stream } from "../../generated/schema";
import {
  EventCancel,
  EventCreateWithTimestamps,
  EventRenounce,
  EventWithdraw,
  EventWithdrawMax,
  ProtoData,
} from "../adapters";
import { createAction } from "../helpers/action";
import {
  createLinearStream,
  generateStreamId,
  getStreamById,
} from "../helpers/stream";
import { zero } from "../constants";

export function handleCreateStream(
  event: EventCreateWithTimestamps,
  system: ProtoData
): Stream | null {
  let stream = createLinearStream(event, system);

  if (stream == null) {
    return null;
  }

  let action = createAction(
    event.instructionProgram,
    event.transactionHash,
    BigInt.fromI64(system.blockTimestamp),
    BigInt.fromU64(system.blockNumber),
    BigInt.fromU64(event.instructionIndex)
  );

  action.category = "Create";
  action.addressA = event.sender;
  action.addressB = event.recipient;
  action.amountA = BigInt.fromU64(event.depositedAmount);

  if (stream.cancelable == false) {
    stream.renounceAction = action.id;
    stream.renounceTime = BigInt.fromI64(system.blockTimestamp);
  }

  stream.save();
  action.stream = stream.id;
  action.save();

  return stream;
}

export function handleCancel(event: EventCancel, system: ProtoData): void {
  let tokenId = event.stream; // TODO: replace with actual stream id after NFTs get implemented
  let stream = getStreamById(tokenId, event.instructionProgram);

  if (stream == null) {
    log.info(
      "[SABLIER] Stream hasn't been registered before this cancel event: {}",
      [generateStreamId(tokenId, event.instructionProgram)]
    );
    log.error("[SABLIER]", []);
    return;
  }

  let action = createAction(
    event.instructionProgram,
    event.transactionHash,
    BigInt.fromI64(system.blockTimestamp),
    BigInt.fromU64(system.blockNumber),
    BigInt.fromU64(event.instructionIndex)
  );

  action.category = "Cancel";
  action.addressA = event.sender;
  action.addressB = stream.recipient;

  action.amountA = BigInt.fromU64(event.refunded);
  action.amountB = stream.depositAmount
    .minus(BigInt.fromU64(event.refunded))
    .minus(stream.withdrawnAmount);
  /** --------------- */

  stream.cancelable = false;
  stream.canceled = true;
  stream.canceledAction = action.id;
  stream.canceledTime = BigInt.fromI64(system.blockTimestamp);
  stream.intactAmount = zero; // TODO: Figure out the only amount remaining in the stream is the non-withdrawn recipient amount (same as amountB)

  stream.save();
  action.stream = stream.id;
  action.save();
}

export function handleRenounce(event: EventRenounce, system: ProtoData): void {
  let tokenId = event.stream; // TODO: replace with actual stream id after NFTs get implemented
  let stream = getStreamById(tokenId, event.instructionProgram);

  if (stream == null) {
    log.info(
      "[SABLIER] Stream hasn't been registered before this cancel event: {}",
      [generateStreamId(tokenId, event.instructionProgram)]
    );
    log.error("[SABLIER]", []);
    return;
  }

  let action = createAction(
    event.instructionProgram,
    event.transactionHash,
    BigInt.fromI64(system.blockTimestamp),
    BigInt.fromU64(system.blockNumber),
    BigInt.fromU64(event.instructionIndex)
  );

  action.category = "Renounce";

  /** --------------- */
  stream.cancelable = false;
  stream.renounceAction = action.id;
  stream.renounceTime = BigInt.fromI64(system.blockTimestamp);

  stream.save();
  action.stream = stream.id;
  action.save();
}

// TODO: implement transfer watcher on the NFT - also change to EventTransfer
export function handleTransfer(event: EventCancel, system: ProtoData): void {
  let tokenId = event.stream; // TODO: replace with actual stream id after NFTs get implemented
  let stream = getStreamById(tokenId, event.instructionProgram);

  if (stream == null) {
    log.info(
      "[SABLIER] Stream hasn't been registered before this cancel event: {}",
      [generateStreamId(tokenId, event.instructionProgram)]
    );
    log.error("[SABLIER]", []);
    return;
  }

  let action = createAction(
    event.instructionProgram,
    event.transactionHash,
    BigInt.fromI64(system.blockTimestamp),
    BigInt.fromU64(system.blockNumber),
    BigInt.fromU64(event.instructionIndex)
  );

  let receiver = stream.recipient; // TODO: extract new recipient

  action.category = "Transfer";

  action.addressA = stream.recipient;
  action.addressB = receiver;

  /** --------------- */

  stream.recipient = receiver;
  let parties = [stream.sender, receiver];

  stream.save();
  action.stream = stream.id;
  action.save();
}

export function handleWithdraw(event: EventWithdraw, system: ProtoData): void {
  let tokenId = event.stream; // TODO: replace with actual stream id after NFTs get implemented
  let stream = getStreamById(tokenId, event.instructionProgram);

  if (stream == null) {
    log.info(
      "[SABLIER] Stream hasn't been registered before this cancel event: {}",
      [generateStreamId(tokenId, event.instructionProgram)]
    );
    log.error("[SABLIER]", []);
    return;
  }

  let action = createAction(
    event.instructionProgram,
    event.transactionHash,
    BigInt.fromI64(system.blockTimestamp),
    BigInt.fromU64(system.blockNumber),
    BigInt.fromU64(event.instructionIndex)
  );

  let amount = BigInt.fromU64(event.amount);

  action.category = "Withdraw";
  action.addressB = stream.recipient; // TODO: check if we have withdraw-to
  action.amountB = amount;

  /** --------------- */

  let withdrawn = stream.withdrawnAmount.plus(amount);
  stream.withdrawnAmount = withdrawn;

  if (stream.canceledAction != null) {
    /** The intact amount (recipient) has been set in the cancel action, now subtract */
    stream.intactAmount = stream.intactAmount.minus(amount);
  } else {
    stream.intactAmount = stream.depositAmount.minus(withdrawn);
  }

  stream.save();
  action.stream = stream.id;
  action.save();
}

export function handleWithdrawMax(
  event: EventWithdrawMax,
  system: ProtoData
): void {
  let tokenId = event.stream; // TODO: replace with actual stream id after NFTs get implemented
  let stream = getStreamById(tokenId, event.instructionProgram);

  if (stream == null) {
    log.info(
      "[SABLIER] Stream hasn't been registered before this cancel event: {}",
      [generateStreamId(tokenId, event.instructionProgram)]
    );
    log.error("[SABLIER]", []);
    return;
  }

  let action = createAction(
    event.instructionProgram,
    event.transactionHash,
    BigInt.fromI64(system.blockTimestamp),
    BigInt.fromU64(system.blockNumber),
    BigInt.fromU64(event.instructionIndex)
  );

  let amount = BigInt.fromU64(event.amount);

  action.category = "Withdraw";
  action.addressB = stream.recipient; // TODO: check if we have withdraw-to
  action.amountB = amount;

  /** --------------- */

  let withdrawn = stream.withdrawnAmount.plus(amount);
  stream.withdrawnAmount = withdrawn;

  if (stream.canceledAction != null) {
    /** The intact amount (recipient) has been set in the cancel action, now subtract */
    stream.intactAmount = stream.intactAmount.minus(amount);
  } else {
    stream.intactAmount = stream.depositAmount.minus(withdrawn);
  }

  stream.save();
  action.stream = stream.id;
  action.save();
}
