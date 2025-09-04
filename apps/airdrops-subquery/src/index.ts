import { atob } from "abab";
import { AbortController, AbortSignal } from "node-abort-controller";
import { EventTarget } from "event-target-shim";
import { TextDecoder, TextEncoder } from "node:util";

if (!global.atob) {
  global.atob = atob as any;
}

// class Noop {}

if (!globalThis.AbortController) {
  globalThis.AbortController = AbortController as any;
  global.AbortController = AbortController as any;
}

if (!globalThis.AbortSignal) {
  globalThis.AbortSignal = AbortSignal as any;
  global.AbortSignal = AbortSignal as any;
}
if (!globalThis.EventTarget) {
  globalThis.EventTarget = EventTarget as any;
  global.EventTarget = EventTarget as any;
}

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder as any;
  global.TextEncoder = TextEncoder as any;
}
if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder as any;
  global.TextDecoder = TextDecoder as any;
}

export * from "./handlers";
