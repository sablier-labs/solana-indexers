import { getChainCode, one, zero } from "../constants";
import { getOrCreateWatcher } from "./watcher";
import { ActionCategory, Action } from "../types";
import { SolanaInstruction } from "@subql/types-solana";

export async function getActionById(id: string): Promise<Action | undefined> {
  return Action.get(id);
}

export async function createAction(
  contractId: string,
  category: ActionCategory,
  instruction: SolanaInstruction
): Promise<Action> {
  const watcher = await getOrCreateWatcher();
  const id = generateActionId(
    instruction.transaction.transaction.signatures[0],
    BigInt(instruction.index[0])
  );

  const entity = Action.create({
    id,

    block: instruction.block.blockHeight,
    hash: instruction.transaction.transaction.signatures[0],
    timestamp: BigInt(instruction.block.blockTime),

    chainCode: watcher.chainCode,
    chainId: watcher.chainId,
    cluster: watcher.cluster,

    category,
    contractId,

    subgraphId: watcher.actionIndex,
    fee: zero // TODO: Implement fees
  });

  /* -------------------------------------------------------------------------- */

  watcher.actionIndex = watcher.actionIndex + one;
  await watcher.save();

  await entity.save();
  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateActionId(hash: string, instruction: BigInt): string {
  const chainCode = getChainCode();

  return ""
    .concat(hash)
    .concat("-")
    .concat(instruction.toString())
    .concat("-")
    .concat(chainCode);
}
