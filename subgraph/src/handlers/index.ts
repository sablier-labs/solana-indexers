import { BigInt, log } from "@graphprotocol/graph-ts";
import { Stream } from "../../generated/schema";
import {
  EventCancel,
  EventCreateWithTimestamps,
  EventRenounce,
  EventSPLTransfer,
  EventWithdraw,
  EventWithdrawMax,
  ProtoData,
} from "../adapters";
import { createAction } from "../helpers/action";
import {
  createLinearStream,
  generateStreamId,
  getStreamById,
  getStreamByTokenId,
} from "../helpers/stream";
import { createOwnership, getOwnership } from "../helpers/ownership";
import { getContractById } from "../helpers/contract";

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

  /** --------------- */

  let ownership = createOwnership(
    event.nftMint,
    BigInt.fromU64(event.streamId),
    event.recipient,
    event.nftRecipientAta
  );

  ownership.stream = stream.id;
  ownership.save();

  return stream;
}

export function handleCancel(event: EventCancel, system: ProtoData): void {
  let tokenId = BigInt.fromU64(event.streamId);
  let stream = getStreamByTokenId(tokenId, event.instructionProgram);

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
  stream.intactAmount = stream.depositAmount
    .minus(BigInt.fromU64(event.refunded))
    .minus(stream.withdrawnAmount);

  stream.save();
  action.stream = stream.id;
  action.save();
}

export function handleRenounce(event: EventRenounce, system: ProtoData): void {
  let tokenId = BigInt.fromU64(event.streamId);
  let stream = getStreamByTokenId(tokenId, event.instructionProgram);

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

export function handleSPLTransfer(
  event: EventSPLTransfer,
  system: ProtoData
): void {
  let fromRecipient = event.fromOwner;

  let toRecipient = event.toOwner;
  let toRecipientAta = event.to;

  let ownership = getOwnership(event.nftMint);

  if (ownership == null) {
    return;
  }

  let stream = getStreamById(ownership.stream);

  if (stream == null) {
    log.info(
      "[SABLIER] Stream hasn't been registered before this transfer event: {}",
      [event.nftMint]
    );
    log.error("[SABLIER]", []);
    return;
  }

  let contract = getContractById(stream.contract);

  if (contract == null) {
    return;
  }

  let action = createAction(
    contract.address,
    event.transactionHash,
    BigInt.fromI64(system.blockTimestamp),
    BigInt.fromU64(system.blockNumber),
    BigInt.fromU64(event.instructionIndex)
  );

  action.category = "Transfer";
  action.addressA = fromRecipient;
  action.addressB = toRecipient;

  /** --------------- */

  stream.recipient = toRecipient;
  stream.recipientNFTAta = toRecipientAta;

  let parties = [stream.sender, toRecipient];
  stream.parties = parties;

  ownership.owner = toRecipient;
  ownership.owner_ata = toRecipientAta;

  stream.save();
  action.stream = stream.id;
  action.save();
  ownership.save();
}

export function handleWithdraw(event: EventWithdraw, system: ProtoData): void {
  let tokenId = BigInt.fromU64(event.streamId);
  let stream = getStreamByTokenId(tokenId, event.instructionProgram);

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
  action.addressB = stream.recipient;
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

  if (stream.recipientAta == null) {
    stream.recipient = event.recipientAta;
  }

  stream.save();
  action.stream = stream.id;
  action.save();
}

export function handleWithdrawMax(
  event: EventWithdrawMax,
  system: ProtoData
): void {
  let tokenId = BigInt.fromU64(event.streamId);
  let stream = getStreamByTokenId(tokenId, event.instructionProgram);

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
  action.addressB = stream.recipient;
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

  if (stream.recipientAta == null) {
    stream.recipient = event.recipientAta;
  }

  stream.save();
  action.stream = stream.id;
  action.save();
}
