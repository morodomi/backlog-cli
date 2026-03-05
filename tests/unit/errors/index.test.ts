import { describe, it, expect, vi, afterEach } from "vitest";
import { handleCommandError } from "../../../src/errors/index.js";

describe("handleCommandError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it("Error インスタンスの場合 message を表示して exitCode=1", () => {
    // Given: Error インスタンス
    const error = new Error("テストエラー");
    vi.spyOn(console, "error").mockImplementation(() => {});

    // When: handleCommandError を呼ぶ
    handleCommandError(error);

    // Then: message が表示され exitCode=1
    expect(console.error).toHaveBeenCalledWith("テストエラー");
    expect(process.exitCode).toBe(1);
  });

  it("文字列の場合そのまま表示して exitCode=1", () => {
    // Given: 文字列
    vi.spyOn(console, "error").mockImplementation(() => {});

    // When: handleCommandError を呼ぶ
    handleCommandError("文字列エラー");

    // Then: 文字列がそのまま表示され exitCode=1
    expect(console.error).toHaveBeenCalledWith("文字列エラー");
    expect(process.exitCode).toBe(1);
  });
});
