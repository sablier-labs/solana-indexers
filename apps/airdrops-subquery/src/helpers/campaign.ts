import { getChainCode, log_error, one, zero } from "../constants";
import { getOrCreateWatcher } from "./watcher";
import { getOrCreateFactory } from "./factory";
import { getOrCreateAsset } from "./asset";
import { InstructionCreate } from "../generated/adapters";
import { bindGetAccount, decodeLogs, fromUint8Array, getProgramId } from "../utils";
import { CampaignCategory, Campaign } from "../types";
import { EventCreate } from "../generated/adapters";

async function getCreated(instruction: InstructionCreate) {
  const logs = (instruction.transaction.meta as any)?.logs || [];
  const decodedList = decodeLogs(logs);

  for (let i = 0; i < decodedList.length; i++) {
    try {
      const decoded = await decodedList[i].decodedMessage;
      if (decoded?.name.toLowerCase() === "CreateCampaign".toLowerCase()) {
        return decoded.data as EventCreate;
      }
    } catch (_error_failed_to_decode) {}
  }

  return undefined;
}

export async function createCampaignInstant(
  instruction: InstructionCreate
): Promise<Campaign | undefined> {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error(`Missing instruction decoding for transaction`, instruction);
    return undefined;
  }

  const params = decoded.data;
  const getAccount = bindGetAccount(instruction);

  const address = getAccount(2);
  const program = getProgramId(instruction);

  /* -------------------------------------------------------------------------- */

  const event = await getCreated(instruction);
  if (!event) {
    log_error(`Missing event decoding for transaction`, instruction);
    return undefined;
  }

  const asset = await getOrCreateAsset(
    getAccount(1), // airdrop_token_mint
    getAccount(4), // airdrop_token_program
    BigInt(event.tokenDecimals) // token_decimals
  );

  asset.program = getAccount(4);
  await asset.save();

  /* -------------------------------------------------------------------------- */

  const factory = await getOrCreateFactory(program);
  const watcher = await getOrCreateWatcher();

  const index = factory.campaignIndex + one;

  factory.campaignIndex = index;
  await factory.save();

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
    startTime: BigInt(params.campaignStartTime),
    expiration: BigInt(params.expirationTime),
    expires: BigInt(params.expirationTime) != zero,
    name: params.name,
    root: fromUint8Array(params.merkleRoot),
    ipfsCID: params.ipfsCid,
    aggregateAmount: BigInt(params.aggregateAmount),
    totalRecipients: BigInt(params.recipientCount)
  });

  /* -------------------------------------------------------------------------- */

  watcher.campaignIndex = watcher.campaignIndex + one;
  await watcher.save();

  await entity.save();
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
