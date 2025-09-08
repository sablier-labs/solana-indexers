// TODO: use adapters once /types avoid @solana/rpc

import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    getU8Decoder,
    getU8Encoder,
    getUtf8Decoder,
    getUtf8Encoder,

    type Codec,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
    type FixedSizeCodec,
    type FixedSizeDecoder,
    type FixedSizeEncoder,
  } from '@solana/codecs';
  
import {   
    getAddressDecoder,
    getAddressEncoder, 
    type Address,
    } from "@solana/addresses"

  export type CreateCampaign = {
    aggregateAmount: bigint;
    campaign: Address;
    campaignName: string;
    campaignStartTime: bigint;
    creator: Address;
    expirationTime: bigint;
    ipfsCid: string;
    merkleRoot: ReadonlyUint8Array;
    recipientCount: number;
    tokenDecimals: number;
    tokenMint: Address;
  };
  
  export type CreateCampaignArgs = {
    aggregateAmount: number | bigint;
    campaign: Address;
    campaignName: string;
    campaignStartTime: number | bigint;
    creator: Address;
    expirationTime: number | bigint;
    ipfsCid: string;
    merkleRoot: ReadonlyUint8Array;
    recipientCount: number;
    tokenDecimals: number;
    tokenMint: Address;
  };
  
  export function getCreateCampaignEncoder(): Encoder<CreateCampaignArgs> {
    return getStructEncoder([
      ['aggregateAmount', getU64Encoder()],
      ['campaign', getAddressEncoder()],
      ['campaignName', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
      ['campaignStartTime', getU64Encoder()],
      ['creator', getAddressEncoder()],
      ['expirationTime', getU64Encoder()],
      ['ipfsCid', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
      ['merkleRoot', fixEncoderSize(getBytesEncoder(), 32)],
      ['recipientCount', getU32Encoder()],
      ['tokenDecimals', getU8Encoder()],
      ['tokenMint', getAddressEncoder()],
    ]);
  }
  
  export function getCreateCampaignDecoder(): Decoder<CreateCampaign> {
    return getStructDecoder([
      ['aggregateAmount', getU64Decoder()],
      ['campaign', getAddressDecoder()],
      ['campaignName', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
      ['campaignStartTime', getU64Decoder()],
      ['creator', getAddressDecoder()],
      ['expirationTime', getU64Decoder()],
      ['ipfsCid', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
      ['merkleRoot', fixDecoderSize(getBytesDecoder(), 32)],
      ['recipientCount', getU32Decoder()],
      ['tokenDecimals', getU8Decoder()],
      ['tokenMint', getAddressDecoder()],
    ]);
  }
  
  export function getCreateCampaignCodec(): Codec<
    CreateCampaignArgs,
    CreateCampaign
  > {
    return combineCodec(getCreateCampaignEncoder(), getCreateCampaignDecoder());
  }
  


export type Claim = {
    amount: bigint;
    campaign: Address;
    claimer: Address;
    claimReceipt: Address;
    feeInLamports: bigint;
    index: number;
    recipient: Address;
  };
  
  export type ClaimArgs = {
    amount: number | bigint;
    campaign: Address;
    claimer: Address;
    claimReceipt: Address;
    feeInLamports: number | bigint;
    index: number;
    recipient: Address;
  };
  
  export function getClaimEncoder(): FixedSizeEncoder<ClaimArgs> {
    return getStructEncoder([
      ['amount', getU64Encoder()],
      ['campaign', getAddressEncoder()],
      ['claimer', getAddressEncoder()],
      ['claimReceipt', getAddressEncoder()],
      ['feeInLamports', getU64Encoder()],
      ['index', getU32Encoder()],
      ['recipient', getAddressEncoder()],
    ]);
  }
  
  export function getClaimDecoder(): FixedSizeDecoder<Claim> {
    return getStructDecoder([
      ['amount', getU64Decoder()],
      ['campaign', getAddressDecoder()],
      ['claimer', getAddressDecoder()],
      ['claimReceipt', getAddressDecoder()],
      ['feeInLamports', getU64Decoder()],
      ['index', getU32Decoder()],
      ['recipient', getAddressDecoder()],
    ]);
  }
  
  export function getClaimCodec(): FixedSizeCodec<ClaimArgs, Claim> {
    return combineCodec(getClaimEncoder(), getClaimDecoder());
  }
  