import { createCampaignInstant } from "../helpers/campaign";
import {
  InstructionClaim,
  InstructionClawback,
  InstructionCreate
} from "../adapters";

export async function handleClaim(instruction: InstructionClaim) {}

export async function handleClawback(instruction: InstructionClawback) {}

export async function handleCreate(instruction: InstructionCreate) {
  let campaign = await createCampaignInstant(instruction);

  if (!campaign) {
    return;
  }

  campaign.save();

  // let action = createAction(
  //   campaign.id,
  //   "Create",
  //   event.transactionHash,
  //   BigInt.fromI64(system.blockTimestamp),
  //   BigInt.fromU64(system.blockNumber),
  //   BigInt.fromU64(event.instructionIndex),
  //   event.creator
  // );

  // if (action == null) {
  //   log_exit("Campaign not registered yet, cannot bind create action");
  //   return;
  // }

  // action.campaign = campaign.id;
  // action.save();
}
