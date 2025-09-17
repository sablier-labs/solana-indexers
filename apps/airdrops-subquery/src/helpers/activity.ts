import { zero, log_error } from "../constants";
import { Activity } from "../types";
import { getCampaignById } from "./campaign";

export async function getActivityById(
  id: string
): Promise<Activity | undefined> {
  return Activity.get(id);
}

export async function getOrCreateActivity(
  campaignId: string,
  timestamp: bigint
): Promise<Activity | undefined> {
  const day = BigInt(Number(timestamp / BigInt(60 * 60 * 24)));

  /** --------------- */
  const campaign = await getCampaignById(campaignId);
  if (!campaign) {
    log_error(`Campaign not registered for activity: ${campaignId}`);
    return undefined;
  }

  /* -------------------------------------------------------------------------- */

  const id = generateActivityId(campaignId, day.toString());
  const activity = await getActivityById(id);

  if (activity) {
    return activity;
  }

  const entity = Activity.create({
    id,

    day,
    campaignId,
    timestamp,

    amount: zero,
    claims: zero
  });

  await entity.save();
  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateActivityId(campaignId: string, day: string): string {
  return ""
    .concat("activity")
    .concat("-")
    .concat(campaignId)
    .concat("-")
    .concat(day);
}
