import { describe, it, expect } from "vitest";
import { InvalidArgumentError } from "commander";
import { parseLimit } from "../../../src/commands/helpers.js";

describe("parseLimit", () => {
  it("有効な数値文字列を数値に変換する", () => {
    expect(parseLimit("10")).toBe(10);
  });

  it("数値1を受け付ける", () => {
    expect(parseLimit("1")).toBe(1);
  });

  it("数値100を受け付ける", () => {
    expect(parseLimit("100")).toBe(100);
  });

  it("非数値文字を含む文字列でエラーになる", () => {
    expect(() => parseLimit("10abc")).toThrow(InvalidArgumentError);
  });

  it("完全な非数値文字列でエラーになる", () => {
    expect(() => parseLimit("abc")).toThrow(InvalidArgumentError);
  });

  it("0でエラーになる", () => {
    expect(() => parseLimit("0")).toThrow(InvalidArgumentError);
  });

  it("101でエラーになる", () => {
    expect(() => parseLimit("101")).toThrow(InvalidArgumentError);
  });

  it("負数でエラーになる", () => {
    expect(() => parseLimit("-1")).toThrow(InvalidArgumentError);
  });

  it("小数でエラーになる", () => {
    expect(() => parseLimit("1.5")).toThrow(InvalidArgumentError);
  });
});
