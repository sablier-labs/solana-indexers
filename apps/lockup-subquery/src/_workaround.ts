// TODO: use adapters once /types avoid @solana/rpc

import {
    combineCodec,
    getU128Decoder,
    getU128Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    getU8Decoder,
    getU8Encoder,


    type FixedSizeCodec,
    type FixedSizeDecoder,
    type FixedSizeEncoder,
  } from '@solana/codecs';
  
import {   
    getAddressDecoder,
    getAddressEncoder, 
    type Address,
  } from "@solana/addresses"



export type CreateLockupLinearStream = {
  depositTokenDecimals: number;
  depositTokenMint: Address;
  recipient: Address;
  salt: bigint;
  streamData: Address;
  streamNftMint: Address;
};

export type CreateLockupLinearStreamArgs = {
  depositTokenDecimals: number;
  depositTokenMint: Address;
  recipient: Address;
  salt: number | bigint;
  streamData: Address;
  streamNftMint: Address;
};

export function getCreateLockupLinearStreamEncoder(): FixedSizeEncoder<CreateLockupLinearStreamArgs> {
  return getStructEncoder([
    ['depositTokenDecimals', getU8Encoder()],
    ['depositTokenMint', getAddressEncoder()],
    ['recipient', getAddressEncoder()],
    ['salt', getU128Encoder()],
    ['streamData', getAddressEncoder()],
    ['streamNftMint', getAddressEncoder()],
  ]);
}

export function getCreateLockupLinearStreamDecoder(): FixedSizeDecoder<CreateLockupLinearStream> {
  return getStructDecoder([
    ['depositTokenDecimals', getU8Decoder()],
    ['depositTokenMint', getAddressDecoder()],
    ['recipient', getAddressDecoder()],
    ['salt', getU128Decoder()],
    ['streamData', getAddressDecoder()],
    ['streamNftMint', getAddressDecoder()],
  ]);
}

export function getCreateLockupLinearStreamCodec(): FixedSizeCodec<
  CreateLockupLinearStreamArgs,
  CreateLockupLinearStream
> {
  return combineCodec(
    getCreateLockupLinearStreamEncoder(),
    getCreateLockupLinearStreamDecoder()
  );
}


export type WithdrawFromLockupStream = {
  depositedTokenMint: Address;
  feeInLamports: bigint;
  streamData: Address;
  streamNftMint: Address;
  withdrawnAmount: bigint;
};

export type WithdrawFromLockupStreamArgs = {
  depositedTokenMint: Address;
  feeInLamports: number | bigint;
  streamData: Address;
  streamNftMint: Address;
  withdrawnAmount: number | bigint;
};

export function getWithdrawFromLockupStreamEncoder(): FixedSizeEncoder<WithdrawFromLockupStreamArgs> {
  return getStructEncoder([
    ['depositedTokenMint', getAddressEncoder()],
    ['feeInLamports', getU64Encoder()],
    ['streamData', getAddressEncoder()],
    ['streamNftMint', getAddressEncoder()],
    ['withdrawnAmount', getU64Encoder()],
  ]);
}

export function getWithdrawFromLockupStreamDecoder(): FixedSizeDecoder<WithdrawFromLockupStream> {
  return getStructDecoder([
    ['depositedTokenMint', getAddressDecoder()],
    ['feeInLamports', getU64Decoder()],
    ['streamData', getAddressDecoder()],
    ['streamNftMint', getAddressDecoder()],
    ['withdrawnAmount', getU64Decoder()],
  ]);
}

export function getWithdrawFromLockupStreamCodec(): FixedSizeCodec<
  WithdrawFromLockupStreamArgs,
  WithdrawFromLockupStream
> {
  return combineCodec(
    getWithdrawFromLockupStreamEncoder(),
    getWithdrawFromLockupStreamDecoder()
  );
}


export type CancelLockupStream = {
  depositedTokenMint: Address;
  recipientAmount: bigint;
  senderAmount: bigint;
  streamData: Address;
  streamNftMint: Address;
};

export type CancelLockupStreamArgs = {
  depositedTokenMint: Address;
  recipientAmount: number | bigint;
  senderAmount: number | bigint;
  streamData: Address;
  streamNftMint: Address;
};

export function getCancelLockupStreamEncoder(): FixedSizeEncoder<CancelLockupStreamArgs> {
  return getStructEncoder([
    ['depositedTokenMint', getAddressEncoder()],
    ['recipientAmount', getU64Encoder()],
    ['senderAmount', getU64Encoder()],
    ['streamData', getAddressEncoder()],
    ['streamNftMint', getAddressEncoder()],
  ]);
}

export function getCancelLockupStreamDecoder(): FixedSizeDecoder<CancelLockupStream> {
  return getStructDecoder([
    ['depositedTokenMint', getAddressDecoder()],
    ['recipientAmount', getU64Decoder()],
    ['senderAmount', getU64Decoder()],
    ['streamData', getAddressDecoder()],
    ['streamNftMint', getAddressDecoder()],
  ]);
}

export function getCancelLockupStreamCodec(): FixedSizeCodec<
  CancelLockupStreamArgs,
  CancelLockupStream
> {
  return combineCodec(
    getCancelLockupStreamEncoder(),
    getCancelLockupStreamDecoder()
  );
}
