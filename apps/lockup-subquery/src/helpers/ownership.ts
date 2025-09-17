import { Ownership } from "../types";
import { getChainCode, getChainId } from "../constants";

export async function getOwnership(
  nftMint: string
): Promise<Ownership | undefined> {
  return Ownership.get(generateOwnershipId(nftMint));
}

export function createOwnership(
  nftMint: string,
  owner: string,
  ownerAta: string,
  streamId: string
): Ownership {
  const id = generateOwnershipId(nftMint);
  const entity = Ownership.create({
    id,
    chainCode: getChainCode(),
    chainId: getChainId(),

    nftMint,
    owner,
    ownerAta,
    streamId
  });

  entity.save();

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateOwnershipId(nftMint: string): string {
  const chainCode = getChainCode();

  return ""
    .concat(nftMint)
    .concat("-")
    .concat(chainCode);
}
