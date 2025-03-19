import { BigInt } from "@graphprotocol/graph-ts";
import { Stream } from "../../generated/schema";
import { EventCreateWithTimestamps, ProtoData } from "../adapters";
import { createAction } from "../helpers/action";
import { createLinearStream } from "../helpers/stream";

export function handleCreateStream(
  event: EventCreateWithTimestamps,
  system: ProtoData
): Stream | null {
  let stream = createLinearStream(event, system);

  if (stream == null) {
    return null;
  }

  let action = createAction(
    event.instructionProgram,
    event.transactionHash,
    BigInt.fromI64(system.blockTimestamp),
    BigInt.fromU64(system.blockNumber),
    BigInt.fromU64(event.instructionIndex)
  );

  action.category = "Create";
  action.addressA = event.acctSender;
  action.addressB = event.acctRecipient;
  action.amountA = BigInt.fromU64(event.depositedAmount);

  if (stream.cancelable == false) {
    stream.renounceAction = action.id;
    stream.renounceTime = BigInt.fromI64(system.blockTimestamp);
  }

  stream.save();
  action.stream = stream.id;
  action.save();

  return stream;
}
