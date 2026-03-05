import { InvalidArgumentError } from "commander";

export function parseLimit(v: string): number {
  if (!/^\d+$/.test(v)) {
    throw new InvalidArgumentError("--limit は 1〜100 の整数を指定してください");
  }
  const n = parseInt(v, 10);
  if (n < 1 || n > 100) {
    throw new InvalidArgumentError("--limit は 1〜100 の整数を指定してください");
  }
  return n;
}
