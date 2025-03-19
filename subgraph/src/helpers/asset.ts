import { BigInt } from "@graphprotocol/graph-ts";
import { Asset } from "../../generated/schema";
import { getChainId, getCluster } from "../constants";

export function getOrCreateAsset(address: string): Asset {
  const chainId = getChainId();
  const cluster = getCluster();

  let id = generateAssetId(address, chainId);

  let entity = Asset.load(id);

  if (entity == null) {
    entity = new Asset(id);

    entity.chainId = chainId;
    entity.cluster = cluster;
    entity.address = address;

    entity.save();
  }

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateAssetId(address: string, chainId: BigInt): string {
  return ""
    .concat(address)
    .concat("-")
    .concat(chainId.toString());
}
