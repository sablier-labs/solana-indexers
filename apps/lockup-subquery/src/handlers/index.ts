import {
  InstructionCancel,
  InstructionCreateWithDurations,
  InstructionCreateWithTimestamps,
  InstructionRenounce,
  InstructionWithdraw,
  InstructionWithdrawMax,
  InstructionSPLTransfer,
  InstructionSPLTransferChecked
} from "../generated/adapters";

// TODO: use adapters once /types avoid @solana/rpc
import {
  getCancelLockupStreamDecoder,
  getWithdrawFromLockupStreamDecoder
} from "../_workaround";

import { createAction } from "../helpers/action";
import { ActionCategory } from "../types";
import { log_error, zero } from "../constants";
import { bindGetAccount, decode, getProgramId } from "../utils";
import {
  createLinearStream,
  getStreamByNftMint,
  handleCreateStreamDependencies
} from "../helpers/stream";

import {
  getSPLTransferCheckedEntities,
  getSPLTransferEntities,
  getSPLTransferMetaEntities,
  handleSPLTransferDependencies
} from "../helpers/transfer";

async function getCanceled(instruction: InstructionCancel) {
  const logs = instruction.transaction.meta?.logMessages || [];
  let found = undefined;
  for (let i = 0; i < logs.length; i++) {
    if (
      (found = decode(
        "CancelLockupStream",
        logs[i],
        getCancelLockupStreamDecoder()
      ))
    ) {
      break;
    }
  }

  return found;
}

export async function handleCanceled(instruction: InstructionCancel) {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error("Missing instruction decoding for transaction", instruction);
    return;
  }
  const program = getProgramId(instruction);
  const getAccount = bindGetAccount(instruction);

  const nftMint = getAccount(5); //streamNftMint

  const stream = await getStreamByNftMint(nftMint, program);

  if (!stream) {
    log_error(
      `Stream hasn't been registered before this cancel event (mint: ${nftMint})`,
      instruction
    );
    return;
  }

  const action = await createAction(
    stream.contractId,
    ActionCategory.Cancel,
    instruction
  );

  /* -------------------------------------------------------------------------- */

  const event = await getCanceled(instruction);
  if (!event) {
    log_error(`Missing event decoding for transaction`, instruction);
    return undefined;
  }

  /* -------------------------------------------------------------------------- */

  action.streamId = stream.id;
  action.addressA = stream.sender;
  action.addressB = stream.recipient;

  action.amountA = BigInt(event.senderAmount); // refunded amount
  action.amountB =
    stream.depositAmount - BigInt(event.senderAmount) - stream.withdrawnAmount;

  await action.save();

  /* -------------------------------------------------------------------------- */

  stream.cancelable = false;
  stream.canceled = true;
  stream.canceledActionId = action.id;
  stream.canceledTime = action.timestamp;
  stream.intactAmount = action.amountB;

  await stream.save();
}

export async function handleCreateWithDurations(
  instruction: InstructionCreateWithDurations
) {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error(`Missing instruction decoding for transaction`, instruction);
    return undefined;
  }
  const params = decoded.data;

  /* -------------------------------------------------------------------------- */

  const cliffDuration = BigInt(params.cliffDuration);
  const startTime = BigInt(instruction.block.blockTime);
  const totalDuration = BigInt(params.totalDuration);

  const times = {
    cliffDuration,
    cliffTime: cliffDuration === zero ? zero : startTime + cliffDuration,

    startTime: startTime,
    endTime: startTime + totalDuration,
    duration: totalDuration
  } as const;

  const stream = await createLinearStream(instruction, times);

  if (!stream) {
    return;
  }

  await handleCreateStreamDependencies(instruction, stream);
}

export async function handleCreateWithTimestamps(
  instruction: InstructionCreateWithTimestamps
) {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error(`Missing instruction decoding for transaction`, instruction);
    return undefined;
  }
  const params = decoded.data;

  /* -------------------------------------------------------------------------- */

  const cliffTime = BigInt(params.cliffTime);
  const startTime = BigInt(params.startTime);
  const endTime = BigInt(params.endTime);

  const times = {
    cliffDuration: cliffTime === zero ? zero : cliffTime - startTime,
    cliffTime,

    startTime: startTime,
    endTime: endTime,
    duration: endTime - startTime
  } as const;

  const stream = await createLinearStream(instruction, times);

  if (!stream) {
    return;
  }

  await handleCreateStreamDependencies(instruction, stream);
}

export async function handleRenounced(instruction: InstructionRenounce) {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error("Missing instruction decoding for transaction", instruction);
    return;
  }
  const program = getProgramId(instruction);
  const getAccount = bindGetAccount(instruction);

  const nftMint = getAccount(5); //streamNftMint

  const stream = await getStreamByNftMint(nftMint, program);

  if (!stream) {
    log_error(
      `Stream hasn't been registered before this renounce event (mint: ${nftMint})`,
      instruction
    );
    return;
  }

  const action = await createAction(
    stream.contractId,
    ActionCategory.Renounce,
    instruction
  );

  /* -------------------------------------------------------------------------- */

  action.streamId = stream.id;
  await action.save();

  /* -------------------------------------------------------------------------- */

  stream.cancelable = false;
  stream.renounceActionId = action.id;
  stream.renounceTime = action.timestamp;

  await stream.save();
}

export async function handleSPLTransfer(instruction: InstructionSPLTransfer) {
  const core = await getSPLTransferEntities(instruction);

  if (!core) {
    return;
  }

  const meta = getSPLTransferMetaEntities(instruction, core.fromOwner);

  if (!meta) {
    return;
  }

  /* -------------------------------------------------------------------------- */

  await handleSPLTransferDependencies(instruction, {
    fromAta: core.fromAta,
    fromOwner: core.fromOwner,
    nftMint: meta.nftMint,
    toAta: core.toAta,
    toOwner: meta.toOwner
  });
}

export async function handleSPLTransferChecked(
  instruction: InstructionSPLTransferChecked
) {
  const core = await getSPLTransferCheckedEntities(instruction);

  if (!core) {
    return;
  }

  const meta = getSPLTransferMetaEntities(instruction, core.fromOwner);

  if (!meta) {
    return;
  }

  /* -------------------------------------------------------------------------- */

  await handleSPLTransferDependencies(instruction, {
    fromAta: core.fromAta,
    fromOwner: core.fromOwner,
    nftMint: meta.nftMint,
    toAta: core.toAta,
    toOwner: meta.toOwner
  });
}

export async function handleWithdraw(instruction: InstructionWithdraw) {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error("Missing instruction decoding for transaction", instruction);
    return;
  }

  const params = decoded.data;
  const program = getProgramId(instruction);
  const getAccount = bindGetAccount(instruction);

  const nftMint = getAccount(5); //streamNftMint

  /* -------------------------------------------------------------------------- */

  const stream = await getStreamByNftMint(nftMint, program);

  if (!stream) {
    log_error(
      `Stream hasn't been registered before this withdraw event (mint: ${nftMint})`,
      instruction
    );
    return;
  }

  const action = await createAction(
    stream.contractId,
    ActionCategory.Withdraw,
    instruction
  );

  /* -------------------------------------------------------------------------- */

  const amount = BigInt(params.amount);

  action.streamId = stream.id;
  action.addressB = getAccount(2); // withdrawalRecipient
  action.amountB = amount;

  await action.save();

  /* -------------------------------------------------------------------------- */

  const withdrawn = stream.withdrawnAmount + amount;

  if (stream.canceledActionId) {
    /** The intact amount (recipient) has been set in the cancel action, now subtract */
    stream.intactAmount = stream.intactAmount - amount;
  } else {
    stream.intactAmount = stream.depositAmount - withdrawn;
  }

  stream.withdrawnAmount = withdrawn;
  await stream.save();
}

async function getWithdrawnMax(instruction: InstructionWithdrawMax) {
  const logs = instruction.transaction.meta?.logMessages || [];
  let found = undefined;
  for (let i = 0; i < logs.length; i++) {
    if (
      (found = decode(
        "WithdrawFromLockupStream",
        logs[i],
        getWithdrawFromLockupStreamDecoder()
      ))
    ) {
      break;
    }
  }

  return found;
}

export async function handleWithdrawMax(instruction: InstructionWithdrawMax) {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error("Missing instruction decoding for transaction", instruction);
    return;
  }

  const params = decoded.data;
  const program = getProgramId(instruction);
  const getAccount = bindGetAccount(instruction);

  const nftMint = getAccount(5); //streamNftMint

  const stream = await getStreamByNftMint(nftMint, program);

  if (!stream) {
    log_error(
      `Stream hasn't been registered before this withdraw max event (mint: ${nftMint})`,
      instruction
    );
    return;
  }

  const action = await createAction(
    stream.contractId,
    ActionCategory.Withdraw,
    instruction
  );

  /* -------------------------------------------------------------------------- */

  const event = await getWithdrawnMax(instruction);
  if (!event) {
    log_error(`Missing event decoding for transaction`, instruction);
    return undefined;
  }

  const amount = BigInt(event.withdrawnAmount);

  /* -------------------------------------------------------------------------- */

  action.streamId = stream.id;
  action.addressB = getAccount(2); // withdrawalRecipient
  action.amountB = amount;

  await action.save();

  /* -------------------------------------------------------------------------- */

  const withdrawn = stream.withdrawnAmount + amount;

  if (stream.canceledActionId) {
    /** The intact amount (recipient) has been set in the cancel action, now subtract */
    stream.intactAmount = stream.intactAmount - amount;
  } else {
    stream.intactAmount = stream.depositAmount - withdrawn;
  }

  stream.withdrawnAmount = withdrawn;
  await stream.save();
}
