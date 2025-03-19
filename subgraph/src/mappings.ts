import { Protobuf } from "as-proto/assembly";
import { ProtoData } from "./adapters";
import { handleCreateStream } from "./handlers";

export function handleTriggers(bytes: Uint8Array): void {
  const input = Protobuf.decode<ProtoData>(
    bytes,
    ProtoData.decode
  ) as ProtoData;

  for (let i = 0; i < input.createWithTimestampsList.length; i++) {
    const event = input.createWithTimestampsList[i];
    handleCreateStream(event, input);
  }

  // for (let i = 0; i < input.withdrawList.length; i++) {
  //   const withdraw = input.withdrawList[i];
  //   const stream = Stream.load(withdraw.acctStream);

  //   if (stream) {
  //     stream.withdrawnAmount = stream.withdrawnAmount.plus(
  //       BigInt.fromU64(withdraw.amount)
  //     );
  //     stream.save();
  //   }
  // }

  // for (let i = 0; i < input.cancelList.length; i++) {
  //   const cancel = input.cancelList[i];
  //   const stream = Stream.load(cancel.acctStream);

  //   if (stream) {
  //     stream.wasCanceled = true;
  //     const remainingAmount = stream.depositedAmount.minus(
  //       stream.withdrawnAmount
  //     );
  //     stream.refundedAmount = stream.refundedAmount.plus(remainingAmount);
  //     stream.save();
  //   }
  // }

  // for (let i = 0; i < input.renounceList.length; i++) {
  //   const renounce = input.renounceList[i];
  //   const stream = Stream.load(renounce.acctStream);

  //   if (stream) {
  //     stream.isCancelable = false;
  //     stream.save();
  //   }
  // }
}
