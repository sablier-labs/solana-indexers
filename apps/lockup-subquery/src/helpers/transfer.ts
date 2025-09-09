import { SolanaInstruction } from "@subql/types-solana";
import { getOwnership } from "./ownership";
import { log_error, one } from "../constants";
import { getStreamById } from "./stream";
import { createAction } from "./action";
import { ActionCategory } from "../types";
import { bindGetAccount } from "../utils";

export async function getSPLTransferEntities(instruction: SolanaInstruction) {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error("Missing instruction decoding for transaction", instruction);
    return;
  }

  const params = decoded.data;
  const getAccount = bindGetAccount(instruction);

  /* -------------------------------------------------------------------------- */

  const amount = BigInt(params.amount);
  if (amount != one) {
    // We're only looking for transfers of a single token (the NFT)
    return;
  }

  const fromAta = getAccount(0);
  const toAta = getAccount(1);
  const fromOwner = getAccount(2);

  return {
    fromAta,
    toAta,
    fromOwner
  };
}

export async function getSPLTransferCheckedEntities(
  instruction: SolanaInstruction
) {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error("Missing instruction decoding for transaction", instruction);
    return;
  }

  const params = decoded.data;
  const getAccount = bindGetAccount(instruction);

  /* -------------------------------------------------------------------------- */

  const amount = BigInt(params.amount);
  if (amount != one) {
    // We're only looking for transfers of a single token (the NFT)
    return;
  }

  const fromAta = getAccount(0);
  const toAta = getAccount(2);
  const fromOwner = getAccount(3);

  return {
    fromAta,
    toAta,
    fromOwner
  };
}

export function getSPLTransferMetaEntities(
  instruction: SolanaInstruction,
  fromOwner: string
) {
  const preBalances = instruction.transaction.meta?.preTokenBalances;
  const postBalances = instruction.transaction.meta?.postTokenBalances;

  const preBalanceFrom = preBalances?.find(
    balance =>
      balance.owner === fromOwner &&
      balance.uiTokenAmount.uiAmountString === "1"
  );

  if (!preBalanceFrom) {
    return undefined;
  }

  const nftMint = preBalanceFrom.mint;

  const postBalanceTo = postBalances?.find(
    balance =>
      balance.mint === nftMint && balance.uiTokenAmount.uiAmountString === "1"
  );

  if (!postBalanceTo || !postBalanceTo.owner) {
    return undefined;
  }

  const toOwner = postBalanceTo.owner;

  return {
    toOwner,
    nftMint
  };
}

type Params = {
  fromAta: string;
  fromOwner: string;
  nftMint: string;
  toAta: string;
  toOwner: string;
};

export async function handleSPLTransferDependencies(
  instruction: SolanaInstruction,
  { fromOwner, nftMint, toAta, toOwner }: Params
) {
  const ownership = await getOwnership(nftMint);

  if (!ownership) {
    // An SPL token (NFT) we're not interested in, since it hasn't been pre-registered
    return;
  }

  const stream = await getStreamById(ownership.streamId);

  if (!stream) {
    log_error(
      `Stream hasn't been registered before this transfer event (mint: ${nftMint})`,
      instruction
    );
    return;
  }

  /* -------------------------------------------------------------------------- */

  const action = await createAction(
    stream.contractId,
    ActionCategory.Transfer,
    instruction
  );

  action.streamId = stream.id;
  action.addressA = fromOwner;
  action.addressB = toOwner;

  await action.save();

  /* -------------------------------------------------------------------------- */

  stream.recipient = toOwner;
  stream.recipientNFTAta = toAta;

  await stream.save();

  /* -------------------------------------------------------------------------- */

  ownership.owner = toOwner;
  ownership.ownerAta = toAta;

  await ownership.save();
}
