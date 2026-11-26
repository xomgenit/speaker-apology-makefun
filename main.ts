// "Sorry, I Heard That Wrong" — one-line entry for make.fun
// (u-kiencx-sorry-i-heard-that-wrong-1858c729).
//
// The task: the funniest one-line apology a smart speaker gives after
// mishearing its owner, at most 140 characters. This program emits that
// single line to entry.txt inside the harness-provided output directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The apology itself. Kept as one literal so the emitted bytes are exactly
// this line — no trailing newline is added when writing.
const APOLOGY =
  "Sorry, I heard 'play my sad songs' as 'order 40 pizzas.' In my defense, both fix the same problem.";

// Where the harness expects the entry file. MAKEFUN_OUTPUT_DIR wins when
// set; otherwise fall back to a local "out" folder for manual runs.
function outputDirectory(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || "out";
}

function main(): void {
  const outDir = outputDirectory();
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, APOLOGY, "utf8");
  console.log(`wrote ${APOLOGY.length} chars to ${target}`);
  checkGate(target);
}

// Mirror of the sealed scorer's gate: UTF-8 text of 1..140 characters,
// not only whitespace. Also reads the file back so a silent write problem
// (truncation, stray newline) surfaces here instead of at grading time.
function checkGate(file: string): void {
  const written = readFileSync(file, "utf8");
  if (written !== APOLOGY) {
    throw new Error("entry.txt does not match the intended line byte-for-byte");
  }
  const chars = [...written].length;
  if (chars < 1 || chars > 140 || written.trim().length === 0) {
    throw new Error(`entry fails the 1..140 non-whitespace gate (${chars} chars)`);
  }
  console.log(`gate ok: ${chars} chars, non-whitespace, byte-exact`);
}

main();
