import { Protobuf } from "as-proto/assembly";
import { BigInt } from "@graphprotocol/graph-ts";
import { Stream } from "../generated/schema";
import { ProtoData } from "./adapters";

export function handleTriggers(bytes: Uint8Array): void {
  const input = Protobuf.decode<ProtoData>(
    bytes,
    ProtoData.decode
  ) as ProtoData;

  for (let i = 0; i < input.createWithTimestampsList.length; i++) {
    const createStream = input.createWithTimestampsList[i];

    const stream = new Stream(createStream.acctStream);

    stream.sender = createStream.acctSender;
    stream.recipient = createStream.acctRecipient;
    stream.senderAta = createStream.acctSenderAta;
    stream.recipientAta = createStream.acctRecipientAta;
    stream.tokenMintAccount = createStream.acctMint;
    stream.depositedAmount = BigInt.fromU64(createStream.depositedAmount);
    stream.withdrawnAmount = BigInt.fromI32(0);
    stream.refundedAmount = BigInt.fromI32(0);
    stream.isCancelable = !!createStream.isCancelable;
    stream.wasCanceled = false;
    stream.startTime = BigInt.fromU64(createStream.startTime);
    stream.cliffTime = BigInt.fromU64(createStream.cliffTime);
    stream.endTime = BigInt.fromU64(createStream.endTime);
    stream.block = BigInt.fromU64(input.blockNumber);
    stream.timestamp = BigInt.fromU64(input.blockTimestamp);

    stream.save();
  }

  for (let i = 0; i < input.withdrawList.length; i++) {
    const withdraw = input.withdrawList[i];
    const stream = Stream.load(withdraw.acctStream);

    if (stream) {
      stream.withdrawnAmount = stream.withdrawnAmount.plus(
        BigInt.fromU64(withdraw.amount)
      );
      stream.save();
    }
  }

  for (let i = 0; i < input.cancelList.length; i++) {
    const cancel = input.cancelList[i];
    const stream = Stream.load(cancel.acctStream);

    if (stream) {
      stream.wasCanceled = true;
      const remainingAmount = stream.depositedAmount.minus(
        stream.withdrawnAmount
      );
      stream.refundedAmount = stream.refundedAmount.plus(remainingAmount);
      stream.save();
    }
  }

  for (let i = 0; i < input.renounceList.length; i++) {
    const renounce = input.renounceList[i];
    const stream = Stream.load(renounce.acctStream);

    if (stream) {
      stream.isCancelable = false;
      stream.save();
    }
  }
}
