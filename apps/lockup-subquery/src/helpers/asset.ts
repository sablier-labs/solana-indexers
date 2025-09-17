import { Asset } from "../types";
import { getChainId, getChainCode, getCluster } from "../constants";

export async function getOrCreateAsset(
  mint: string,
  program: string,
  decimals: bigint
): Promise<Asset> {
  const id = mint;

  const found = await Asset.get(id);

  if (found) {
    return found;
  }

  const entity = Asset.create({
    id,
    chainCode: getChainCode(),
    chainId: getChainId(),
    cluster: getCluster(),
    address: mint,
    mint,
    program,
    decimals
  });

  entity.save();

  return entity;
}
