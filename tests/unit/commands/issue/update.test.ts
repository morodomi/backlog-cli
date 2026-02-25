import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerIssueUpdateCommand } from "../../../../src/commands/issue/update.js";
import { createIssueFixture } from "../../../helpers/fixtures.js";

describe("issue update command", () => {
  let program: Command;
  let mockIssueService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockIssueService = {
      update: vi
        .fn()
        .mockResolvedValue(createIssueFixture({ issueKey: "PRJ-1", summary: "更新済み" })),
    };
    registerIssueUpdateCommand(program, mockIssueService);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("ステータスを更新する", async () => {
    await program.parseAsync(["node", "test", "update", "PRJ-1", "--status", "処理中"]);

    expect(mockIssueService.update).toHaveBeenCalledWith("PRJ-1", {
      statusName: "処理中",
    });
    expect(console.log).toHaveBeenCalled();
  });

  it("複数フィールドを同時に更新する", async () => {
    await program.parseAsync([
      "node",
      "test",
      "update",
      "PRJ-1",
      "--status",
      "処理中",
      "--assignee",
      "山田太郎",
      "--priority",
      "高",
      "--type",
      "バグ",
      "--category",
      "フロントエンド",
      "--milestone",
      "v1.0",
      "--comment",
      "更新コメント",
    ]);

    expect(mockIssueService.update).toHaveBeenCalledWith("PRJ-1", {
      statusName: "処理中",
      assigneeName: "山田太郎",
      priorityName: "高",
      issueTypeName: "バグ",
      categoryNames: ["フロントエンド"],
      milestoneNames: ["v1.0"],
      comment: "更新コメント",
    });
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync(["node", "test", "update", "PRJ-1", "--status", "処理中", "--json"]);

    const calls = (console.log as any).mock.calls;
    const jsonOutput = calls[0][0];
    expect(() => JSON.parse(jsonOutput)).not.toThrow();
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    mockIssueService.update.mockRejectedValue(new Error("更新に失敗しました"));
    const originalExitCode = process.exitCode;

    await program.parseAsync(["node", "test", "update", "PRJ-1", "--status", "処理中"]);

    expect(console.error).toHaveBeenCalledWith("更新に失敗しました");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});
