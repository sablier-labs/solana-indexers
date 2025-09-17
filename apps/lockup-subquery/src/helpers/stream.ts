import { SolanaInstruction } from "@subql/types-solana";
import { getChainCode, log_error, one, zero } from "../constants";
import { getOrCreateWatcher } from "./watcher";
import { getOrCreateContract } from "./contract";
import { getOrCreateAsset } from "./asset";
import {
  EventCreate,
  InstructionCreateWithDurations,
  InstructionCreateWithTimestamps
} from "../generated/adapters";
import { bindGetAccount, getProgramId } from "../utils";
import { ActionCategory, Contract, Stream, StreamCategory } from "../types";
import { createOwnership } from "./ownership";
import { createAction } from "./action";

async function getCreated(
  instruction: InstructionCreateWithDurations | InstructionCreateWithTimestamps
) {
  const logs = instruction.transaction.meta?.logMessages || [];
  const list = decoder.decodeLogs(logs) || [];

  for (let i = 0; i < logs.length; i++) {
    try {
      const decoded = await list[i].decodedMessage;
      if (
        decoded?.name.toLowerCase() === "CreateLockupLinearStream".toLowerCase()
      ) {
        return decoded.data as EventCreate;
      }
    } catch (_error_failed_to_decode) {}
  }

  return undefined;
}

export async function createStream(instruction: SolanaInstruction) {
  const program = getProgramId(instruction);
  const getAccount = bindGetAccount(instruction);

  const contract = await getOrCreateContract(program);
  const watcher = await getOrCreateWatcher();

  /* -------------------------------------------------------------------------- */

  const nftMint = getAccount(9); // nftMint
  const id = generateStreamId(nftMint, program);
  const alias = generateStreamAlias(nftMint, contract);

  const partial = {
    id,

    contractId: contract.id,
    hash: instruction.transaction.transaction.signatures[0],
    instruction: BigInt(instruction.index[0]),
    timestamp: instruction.block.blockTime,

    chainCode: watcher.chainCode,
    chainId: watcher.chainId,
    cluster: watcher.cluster,

    alias,
    version: contract.version,
    subgraphId: watcher.streamIndex,

    cliff: false,
    initial: false,
    canceled: false,
    transferable: true /**  All streams are transferable by default */,
    withdrawnAmount: zero
  };

  watcher.streamIndex = watcher.streamIndex + one;
  await watcher.save();

  return {
    partial,

    contract,
    watcher
  } as const;
}

type Times = {
  cliffDuration: bigint;
  cliffTime: bigint;
  duration: bigint;
  endTime: bigint;
  startTime: bigint;
};

export async function createLinearStream(
  instruction: InstructionCreateWithDurations | InstructionCreateWithTimestamps,
  times: Times
): Promise<Stream | undefined> {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error(`Missing instruction decoding for transaction`, instruction);
    return undefined;
  }

  const params = decoded.data;
  const getAccount = bindGetAccount(instruction);

  /* -------------------------------------------------------------------------- */

  const { partial } = await createStream(instruction);

  /* -------------------------------------------------------------------------- */

  const event = await getCreated(instruction);
  if (!event) {
    log_error(`Missing event decoding for transaction`, instruction);
    return undefined;
  }

  const asset = await getOrCreateAsset(
    getAccount(8), // deposit_token_mint
    getAccount(16), // deposit_token_program
    BigInt(event.depositTokenDecimals) // token_decimals
  );

  asset.program = getAccount(4);
  await asset.save();

  /* -------------------------------------------------------------------------- */

  const entity = Stream.create({
    ...partial,

    salt: event.salt.toString(),
    category: StreamCategory.LockupLinear,
    assetId: asset.id,

    funder: getAccount(1), // creator
    recipient: getAccount(2), // recipient
    sender: getAccount(3), // sender
    recipientNFTAta: getAccount(10), // recipientStreamNftAta

    funderAta: getAccount(2), // creatorAta

    nftMint: getAccount(9), // nftMint
    nftData: getAccount(11), // nftData

    depositAmount: BigInt(params.depositAmount),
    intactAmount: BigInt(params.depositAmount),

    cancelable: params.isCancelable,

    startTime: times.startTime,
    endTime: times.endTime,
    duration: times.duration,

    ...(times.cliffTime !== zero
      ? {
          cliff: true,
          cliffAmount: BigInt(params.cliffUnlockAmount),
          cliffTime: times.cliffTime
        }
      : { cliff: false }),

    ...(BigInt(params.startUnlockAmount) !== zero
      ? { initial: true, initialAmount: BigInt(params.startUnlockAmount) }
      : { initial: false })
  });

  /* -------------------------------------------------------------------------- */

  await entity.save();
  return entity;
}

export async function handleCreateStreamDependencies(
  instruction: InstructionCreateWithDurations | InstructionCreateWithTimestamps,
  stream: Stream
): Promise<Stream | undefined> {
  /* -------------------------------------------------------------------------- */

  const action = await createAction(
    stream.contractId,
    ActionCategory.Create,
    instruction
  );

  if (!action) {
    return;
  }

  action.addressA = stream.sender;
  action.addressB = stream.recipient;
  action.amountA = stream.depositAmount;
  action.streamId = stream.id;

  await action.save();

  /* -------------------------------------------------------------------------- */

  if (!stream.cancelable) {
    stream.renounceActionId = action.id;
    stream.renounceTime = stream.timestamp;
  }

  await stream.save();

  /* -------------------------------------------------------------------------- */

  const ownership = await createOwnership(
    stream.nftMint,
    stream.recipient,
    stream.recipientNFTAta,
    stream.id
  );

  await ownership.save();

  return stream;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateStreamId(nftMint: string, program: string): string {
  const chainCode = getChainCode();

  let id = ""
    .concat(program)
    .concat("-")
    .concat(chainCode)
    .concat("-")
    .concat(nftMint);

  return id;
}

export function generateStreamAlias(
  nftMint: string,
  contract: Contract
): string {
  let alias = ""
    .concat(contract.alias)
    .concat("-")
    .concat(contract.chainCode)
    .concat("-")
    .concat(nftMint);

  return alias;
}

export async function getStreamByNftMint(
  nftMint: string,
  program: string
): Promise<Stream | undefined> {
  let id = generateStreamId(nftMint, program);
  return Stream.get(id);
}

export async function getStreamById(
  streamId: string
): Promise<Stream | undefined> {
  return Stream.get(streamId);
}
