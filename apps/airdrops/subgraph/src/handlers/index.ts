import { BigInt, log } from "@graphprotocol/graph-ts";

import { EventClaim, EventClawback, EventCreate, ProtoData } from "../adapters";

export function handleClaim(_event: EventClaim, _system: ProtoData): void {}

export function handleClawback(
  _event: EventClawback,
  _system: ProtoData
): void {}

export function handleCreate(_event: EventCreate, _system: ProtoData): void {}
