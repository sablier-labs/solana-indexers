import { getChainCode, log_exit, one, zero } from "../constants";
import { getOrCreateWatcher } from "./watcher";
import { getOrCreateFactory } from "./factory";
import { getOrCreateAsset } from "./asset";
import { InstructionCreate } from "../adapters";
import { bindGetAccount, fromUint8Array } from "../utils";
import { CampaignCategory, Campaign } from "../types";
import assert from "node:assert";

import { SolanaLogMessage } from "@subql/types-solana";
import { getCreateCampaignDecoder } from "../types/program-interfaces/GrZhWdwBgZakydbyUMx1eTkCT5Eei7LC21i87Ag7Vh1D";

export async function createCampaignInstant(
  instruction: InstructionCreate
): Promise<Campaign | undefined> {
  const decoded = await instruction.decodedData;
  assert(decoded, "Expected decoded value");

  const params = decoded.data;
  const getAccount = bindGetAccount(instruction);

  const address = getAccount(2);
  const program = getAccount(instruction.programIdIndex);

  /* -------------------------------------------------------------------------- */

  let asset = await getOrCreateAsset(
    getAccount(1), // airdropTokenMint
    getAccount(4), // airdropTokenProgram
    BigInt(9) // TODO 🚨🚨🚨🚨🚨🚨🚨🚨 event.airdropTokenDecimals
  );

  /* -------------------------------------------------------------------------- */

  const factory = await getOrCreateFactory(program);
  const index = factory.campaignIndex + one;

  factory.campaignIndex = index;
  await factory.save();

  /* -------------------------------------------------------------------------- */
  const watcher = await getOrCreateWatcher();
  watcher.campaignIndex = watcher.campaignIndex + one;
  await watcher.save();

  /* -------------------------------------------------------------------------- */
  const id = generateCampaignId(address);
  if (!id) {
    return undefined;
  }

  /* -------------------------------------------------------------------------- */

  const entity = Campaign.create({
    id,
    address,
    factoryId: factory.id,

    hash: instruction.transaction.transaction.signatures[0],
    instruction: BigInt(instruction.index[0]),
    timestamp: instruction.block.blockTime,

    chainCode: watcher.chainCode,
    chainId: watcher.chainId,
    cluster: watcher.cluster,

    version: factory.version,
    subgraphId: watcher.campaignIndex,

    claimedAmount: zero,
    claimedCount: zero,
    position: index,
    fee: zero,

    /* -------------------------------------------------------------------------- */

    category: CampaignCategory.Instant,
    admin: getAccount(0), // creator
    assetId: asset.id,
    ata: getAccount(3), // campaign_ata
    start: BigInt(params.campaignStartTime),
    expiration: BigInt(params.expirationTime),
    expires: BigInt(params.expirationTime) != zero,
    name: params.name,
    root: fromUint8Array(params.merkleRoot),
    ipfsCID: params.ipfsCid,
    aggregateAmount: BigInt(params.aggregateAmount),
    totalRecipients: BigInt(params.recipientCount)
  });

  if (!entity) {
    log_exit("Campaign hasn't been registered.");
    return undefined;
  }

  entity.save();
  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateCampaignId(campaignAccount: string): string {
  const chainCode = getChainCode();

  let id = ""
    .concat(campaignAccount)
    .concat("-")
    .concat(chainCode);

  return id;
}

export async function getCampaignByAccount(
  campaignAccount: string
): Promise<Campaign | undefined> {
  let id = generateCampaignId(campaignAccount);
  return Campaign.get(id);
}

export async function getCampaignById(
  campaignId: string
): Promise<Campaign | undefined> {
  return Campaign.get(campaignId);
}
