import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerIssueListCommand } from "../../../../src/commands/issue/list.js";
import { createIssueFixture } from "../../../helpers/fixtures.js";

describe("issue list command", () => {
  let program: Command;
  let mockIssueService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockIssueService = {
      list: vi.fn().mockResolvedValue([createIssueFixture({ issueKey: "PRJ-1" })]),
      resolveStatusIds: vi.fn().mockResolvedValue([1]),
      getStatuses: vi.fn().mockResolvedValue([]),
    };
    registerIssueListCommand(program, mockIssueService);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("-p でプロジェクトキーを指定して課題一覧を取得する", async () => {
    await program.parseAsync(["node", "test", "list", "-p", "PRJ"]);

    expect(mockIssueService.list).toHaveBeenCalledWith(
      expect.objectContaining({ projectKey: "PRJ" }),
    );
    expect(console.log).toHaveBeenCalled();
  });

  it("--limit で取得件数を指定できる", async () => {
    await program.parseAsync(["node", "test", "list", "-p", "PRJ", "--limit", "5"]);

    expect(mockIssueService.list).toHaveBeenCalledWith(expect.objectContaining({ limit: 5 }));
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync(["node", "test", "list", "-p", "PRJ", "--json"]);

    const calls = (console.log as any).mock.calls;
    const jsonOutput = calls[0][0];
    expect(() => JSON.parse(jsonOutput)).not.toThrow();
  });

  it("--status でステータスフィルタを指定できる", async () => {
    await program.parseAsync(["node", "test", "list", "-p", "PRJ", "--status", "未対応"]);

    expect(mockIssueService.resolveStatusIds).toHaveBeenCalledWith("PRJ", ["未対応"]);
    expect(mockIssueService.list).toHaveBeenCalledWith(expect.objectContaining({ statusId: [1] }));
  });

  it("-p が未指定の場合エラーになる", async () => {
    await expect(program.parseAsync(["node", "test", "list"])).rejects.toThrow();
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    mockIssueService.list.mockRejectedValue(new Error("API connection failed"));
    const originalExitCode = process.exitCode;

    await program.parseAsync(["node", "test", "list", "-p", "PRJ"]);

    expect(console.error).toHaveBeenCalledWith("API connection failed");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});
