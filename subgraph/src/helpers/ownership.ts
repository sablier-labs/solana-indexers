import { BigInt } from "@graphprotocol/graph-ts";
import { Ownership } from "../../generated/schema";
import { getChainId } from "../constants";

export function getOwnership(mint: string): Ownership | null {
  const chainId = getChainId();

  return Ownership.load(generateOwnershipId(mint, chainId));
}

export function createOwnership(
  mint: string,
  tokenId: BigInt,
  owner: string,
  owner_ata: string
): Ownership {
  const chainId = getChainId();

  let id = generateOwnershipId(mint, chainId);
  let entity = new Ownership(id);

  entity.chainId = chainId;
  entity.tokenId = tokenId;

  entity.mint = mint;
  entity.owner = owner;
  entity.owner_ata = owner_ata;

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateOwnershipId(ata: string, chainId: BigInt): string {
  return ""
    .concat(ata)
    .concat("-")
    .concat(chainId.toString());
}
