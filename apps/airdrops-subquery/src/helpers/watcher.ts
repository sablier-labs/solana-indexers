import { Watcher } from "../types";
import { getChainCode, getChainId, getCluster, one } from "../constants";

export async function getOrCreateWatcher(): Promise<Watcher> {
  const id = getChainCode().toString();
  const found = await Watcher.get(id);

  if (found) {
    return found;
  }

  const entity = Watcher.create({
    id,
    chainCode: getChainCode(),
    chainId: getChainId(),
    cluster: getCluster(),
    campaignIndex: one,
    actionIndex: one,
    initialized: true,
    logs: []
  });

  await entity.save();

  return entity;
}
