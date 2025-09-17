import { AbortController, AbortSignal } from "abort-controller";
import { EventTarget } from "event-target-shim";
import { TextDecoder, TextEncoder } from "fastestsmallesttextencoderdecoder";

/* -------------------------------------------------------------------------- */
/*                                  POLYFILLS                                 */
/* -------------------------------------------------------------------------- */

/**
 * @description
 * The @solana/kit uses these internally, but the node runtime used by `subquery-node`
 * will not have them. It's important for TextEncoder and TextDecoder to be
 * polyfilled from the exact dependency used in the kit.
 *
 * https://github.com/anza-xyz/kit/blob/afbab0bad78d88df95bc5af01a4f921df8e08515/packages/text-encoding-impl/src/index.native.ts
 */

globalThis.TextEncoder = TextEncoder as any;
globalThis.TextDecoder = TextDecoder as any;
globalThis.AbortController = AbortController as any;
globalThis.AbortSignal = AbortSignal as any;
globalThis.EventTarget = EventTarget as any;

export * from "./handlers";
