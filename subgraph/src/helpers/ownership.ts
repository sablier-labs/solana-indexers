import { BigInt } from "@graphprotocol/graph-ts";
import { Ownership } from "../../generated/schema";
import { getChainCode, getChainId } from "../constants";

export function getOwnership(mint: string): Ownership | null {
  return Ownership.load(generateOwnershipId(mint));
}

export function createOwnership(
  mint: string,
  tokenId: BigInt,
  owner: string,
  owner_ata: string
): Ownership {
  let id = generateOwnershipId(mint);
  let entity = new Ownership(id);

  entity.chainCode = getChainCode();
  entity.chainId = getChainId();
  entity.tokenId = tokenId;

  entity.mint = mint;
  entity.owner = owner;
  entity.owner_ata = owner_ata;

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateOwnershipId(ata: string): string {
  const chainCode = getChainCode();

  return ""
    .concat(ata)
    .concat("-")
    .concat(chainCode);
}
