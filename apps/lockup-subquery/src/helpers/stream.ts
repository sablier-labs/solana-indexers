import { getChainCode, log_error, one, zero } from "../constants";
import { getOrCreateWatcher } from "./watcher";
import { getOrCreateContract } from "./contract";
import { getOrCreateAsset } from "./asset";
import {
  InstructionCancel,
  InstructionCreateWithDurations,
  InstructionCreateWithTimestamps,
  InstructionRenounce,
  InstructionWithdraw,
  InstructionWithdrawMax
} from "../generated/adapters";
import { bindGetAccount, decode, fromUint8Array, getProgramId } from "../utils";
import { Contract, Stream, StreamCategory } from "../types";

// TODO: use adapters once /types avoid @solana/rpc
import {
  getCreateLockupLinearStreamDecoder,
  getCancelLockupStreamDecoder,
  getWithdrawFromLockupStreamDecoder
} from "../_workaround";
import { SolanaInstruction } from "@subql/types-solana";

async function getCreated(
  instruction: InstructionCreateWithDurations | InstructionCreateWithTimestamps
) {
  const logs = instruction.transaction.meta?.logMessages || [];
  let found = undefined;
  for (let i = 0; i < logs.length; i++) {
    if (
      (found = decode(
        "CreateLockupLinearStream",
        logs[i],
        getCreateLockupLinearStreamDecoder()
      ))
    ) {
      break;
    }
  }

  return found;
}

export async function createStream(instruction: SolanaInstruction) {
  const program = getProgramId(instruction);
  const getAccount = bindGetAccount(instruction);

  const contract = await getOrCreateContract(program);
  const watcher = await getOrCreateWatcher();

  /* -------------------------------------------------------------------------- */

  const nftMint = getAccount(9);
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

export async function createLinearStream(
  instruction: InstructionCreateWithDurations
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

    funder: getAccount(1), // creator
    recipient: getAccount(2), // recipient
    sender: getAccount(3), // sender
    recipientNFTAta: getAccount(10), // recipientStreamNftAta

    senderAta: getAccount(2) // creatorAta
  });

  /* -------------------------------------------------------------------------- */

  await entity.save();
  return entity;
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
