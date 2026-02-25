import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerIssueCommentCommand } from "../../../../src/commands/issue/comment.js";

describe("issue comment command", () => {
  let program: Command;
  let mockIssueService: any;

  const mockComment = {
    id: 1,
    content: "テストコメント",
    changeLog: [],
    createdUser: { id: 1, name: "テストユーザー" },
    created: "2024-01-01T00:00:00Z",
    updated: "2024-01-01T00:00:00Z",
    stars: [],
    notifications: [],
  };

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockIssueService = {
      comment: vi.fn().mockResolvedValue(mockComment),
    };
    registerIssueCommentCommand(program, mockIssueService);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("課題にコメントを追加する", async () => {
    await program.parseAsync(["node", "test", "comment", "PRJ-1", "--content", "テストコメント"]);

    expect(mockIssueService.comment).toHaveBeenCalledWith("PRJ-1", "テストコメント");
    expect(console.log).toHaveBeenCalled();
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync([
      "node",
      "test",
      "comment",
      "PRJ-1",
      "--content",
      "テストコメント",
      "--json",
    ]);

    const calls = (console.log as any).mock.calls;
    const jsonOutput = calls[0][0];
    expect(() => JSON.parse(jsonOutput)).not.toThrow();
  });

  it("--content 未指定でエラーになる", async () => {
    await expect(program.parseAsync(["node", "test", "comment", "PRJ-1"])).rejects.toThrow();
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    mockIssueService.comment.mockRejectedValue(new Error("コメント追加に失敗しました"));
    const originalExitCode = process.exitCode;

    await program.parseAsync(["node", "test", "comment", "PRJ-1", "--content", "テストコメント"]);

    expect(console.error).toHaveBeenCalledWith("コメント追加に失敗しました");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});
