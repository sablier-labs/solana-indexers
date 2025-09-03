import type{ SolanaInstruction } from "@subql/types-solana";
import type { ReadonlyUint8Array, TransactionForFullJson } from "@solana/kit";

export function fromBN(value: any): any {
  if (typeof value === "bigint") {
    return `${value.toString()}n`;
  }
  return value;
}

export function fromUint8Array(bytes: Uint8Array | ReadonlyUint8Array): string {
  return (
    "0x" +
    Array.from(bytes)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function getAccounts(transaction: TransactionForFullJson<0>) {
  return [
    ...transaction.transaction.message.accountKeys,
    ...(transaction.meta?.loadedAddresses.writable ?? []),
    ...(transaction.meta?.loadedAddresses.readonly ?? [])
  ];
}

export function getAccount(
  instruction: SolanaInstruction,
  index: number
): string {
  return getAccounts(instruction.transaction)[instruction.accounts[index]];
}

export function bindGetAccount(instruction: SolanaInstruction) {
  return (index: number) => getAccount(instruction, index);
}

export function getProgramId(instruction: SolanaInstruction): string {
  return getAccounts(instruction.transaction)[instruction.programIdIndex];
}

export { decode } from "./decoder";
