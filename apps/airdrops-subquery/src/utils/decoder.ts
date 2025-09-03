import { createHash } from "node:crypto";
import { Buffer } from "node:buffer";
import { getCreateCampaignDecoder } from "../adapters";

// Strip program data and convert log to Uint8Array
function formatLogToUint8Array(logWithProgramData: string): Uint8Array {
  const base64 = logWithProgramData.split("Program data: ")[1]?.trim();
  const uint8Array = new Uint8Array(Buffer.from(base64, "base64"));

  return uint8Array;
}

// Discriminator are the first 8 bytes of the sha256 over the event's name
function getDiscriminator(name: string): Uint8Array {
  const hash = createHash("sha256")
    .update(`event:${name}`)
    .digest();
  return new Uint8Array(hash.subarray(0, 8));
}

function isDiscriminatedEvent(name: string, log: Uint8Array) {
  if (log.length < 8) {
    // Missing discriminator
    return false;
  }

  const discriminator = getDiscriminator(name);

  for (let i = 0; i < 8; i++) {
    if (discriminator[i] !== log[i]) {
      return false;
    }
  }

  return true;
}

type Decoder<T> = {
  decode: (bytes: Uint8Array, offset?: number) => T;
  read: (bytes: Uint8Array, offset: number) => [T, number];
};

export function decode<T>(
  event: string,
  logWithProgramData: string,
  structDecoder: Decoder<T>
): T | undefined {
  if (!logWithProgramData.startsWith("Program data: ")) {
    return undefined;
  }

  const log = formatLogToUint8Array(logWithProgramData);

  if (!isDiscriminatedEvent(event, log)) {
    return undefined;
  }

  try {
    // const [value] = structDecoder.read(log.subarray(8), 0);
    const value = getCreateCampaignDecoder().decode(log.subarray(8), 0);
    return value as T;
  } catch (e) {
    logger.error("EEEE -----");
    logger.error(JSON.stringify({ log }));
    throw new Error(e as any);
  }
}
