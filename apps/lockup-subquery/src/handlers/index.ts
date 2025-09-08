import { createCampaignInstant, getCampaignByAccount } from "../helpers/stream";
import {} from "../generated/adapters";

// TODO: use adapters once /types avoid @solana/rpc
import { getClaimDecoder } from "../_workaround";

import { createAction } from "../helpers/action";
import { ActionCategory } from "../types";
import { log_error, one } from "../constants";
import { bindGetAccount, decode } from "../utils";
import { getOrCreateActivity } from "../helpers/activity";

async function getClaimed(instruction: InstructionClaim) {
  const logs = instruction.transaction.meta?.logMessages || [];
  let found = undefined;
  for (let i = 0; i < logs.length; i++) {
    if ((found = decode("Claim", logs[i], getClaimDecoder()))) {
      break;
    }
  }

  return found;
}

export async function handleClaim(instruction: InstructionClaim) {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error("Missing instruction decoding for transaction", instruction);
    return;
  }

  const getAccount = bindGetAccount(instruction);

  const campaign = await getCampaignByAccount(getAccount(4)); // campaign

  if (!campaign) {
    log_error("Campaign not registered yet", instruction);
    return;
  }

  const action = await createAction(
    campaign.id,
    ActionCategory.Claim,
    instruction,
    getAccount(0) // claimer
  );

  if (!action) {
    return;
  }

  /* -------------------------------------------------------------------------- */

  const event = await getClaimed(instruction);
  if (!event) {
    log_error(`Missing event decoding for transaction`, instruction);
    return undefined;
  }

  /* -------------------------------------------------------------------------- */

  action.claimIndex = BigInt(event.index);
  action.claimAmount = BigInt(event.amount);
  action.claimReceipt = event.recipient;
  action.claimReceipt = event.claimReceipt;

  await action.save();

  /* -------------------------------------------------------------------------- */

  campaign.claimedAmount = campaign.claimedAmount + action.claimAmount;
  campaign.claimedCount = campaign.claimedCount + one;

  await campaign.save();

  /* -------------------------------------------------------------------------- */

  const activity = await getOrCreateActivity(
    campaign.id,
    BigInt(instruction.block.blockTime)
  );

  if (!activity) {
    return;
  }

  activity.claims = activity.claims + one;
  activity.amount = activity.amount + event.amount;

  await activity.save();
}

export async function handleClawback(instruction: InstructionClawback) {
  const decoded = await instruction.decodedData;
  if (!decoded) {
    log_error("Missing instruction decoding for transaction", instruction);
    return;
  }

  const params = decoded.data;
  const getAccount = bindGetAccount(instruction);

  const campaign = await getCampaignByAccount(getAccount(4)); // campaign

  if (!campaign) {
    log_error("Campaign not registered yet", instruction);
    return;
  }

  const action = await createAction(
    campaign.id,
    ActionCategory.Clawback,
    instruction,
    getAccount(0) // campaign_creator
  );

  if (!action) {
    return;
  }

  /* -------------------------------------------------------------------------- */

  action.clawbackFrom = getAccount(0); // campaign_creator
  action.clawbackTo = getAccount(1); // clawback_recipient
  action.clawbackAmount = BigInt(params.amount);

  await action.save();

  /* -------------------------------------------------------------------------- */

  campaign.clawbackTime = BigInt(instruction.block.blockTime);
  campaign.clawbackActionId = action.id;

  await campaign.save();
}

export async function handleCreate(instruction: InstructionCreate) {
  const campaign = await createCampaignInstant(instruction);

  if (!campaign) {
    return;
  }

  const action = await createAction(
    campaign.id,
    ActionCategory.Create,
    instruction,
    campaign.admin
  );

  if (!action) {
    return;
  }
}
