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

  const mockComments = [
    {
      id: 1,
      content: "コメント1",
      changeLog: [],
      createdUser: { id: 1, name: "ユーザー1" },
      created: "2024-01-01T10:00:00Z",
      updated: "2024-01-01T10:00:00Z",
      stars: [],
      notifications: [],
    },
    {
      id: 2,
      content: "コメント2",
      changeLog: [],
      createdUser: { id: 2, name: "ユーザー2" },
      created: "2024-01-02T10:00:00Z",
      updated: "2024-01-02T10:00:00Z",
      stars: [],
      notifications: [],
    },
  ];

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockIssueService = {
      comment: vi.fn().mockResolvedValue(mockComment),
      listComments: vi.fn().mockResolvedValue(mockComments),
    };
    registerIssueCommentCommand(program, mockIssueService);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("comment add", () => {
    it("課題にコメントを追加する", async () => {
      await program.parseAsync([
        "node",
        "test",
        "comment",
        "add",
        "PRJ-1",
        "--content",
        "テストコメント",
      ]);

      expect(mockIssueService.comment).toHaveBeenCalledWith("PRJ-1", "テストコメント");
      expect(console.log).toHaveBeenCalled();
    });

    it("--json でJSON出力する", async () => {
      await program.parseAsync([
        "node",
        "test",
        "comment",
        "add",
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
      await expect(
        program.parseAsync(["node", "test", "comment", "add", "PRJ-1"]),
      ).rejects.toThrow();
    });

    it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
      mockIssueService.comment.mockRejectedValue(new Error("コメント追加に失敗しました"));
      const originalExitCode = process.exitCode;

      await program.parseAsync([
        "node",
        "test",
        "comment",
        "add",
        "PRJ-1",
        "--content",
        "テストコメント",
      ]);

      expect(console.error).toHaveBeenCalledWith("コメント追加に失敗しました");
      expect(process.exitCode).toBe(1);
      process.exitCode = originalExitCode;
    });
  });

  describe("comment list", () => {
    it("コメント一覧を表示する", async () => {
      await program.parseAsync(["node", "test", "comment", "list", "PRJ-1"]);

      expect(mockIssueService.listComments).toHaveBeenCalledWith("PRJ-1", {
        count: 10,
      });
      expect(console.log).toHaveBeenCalled();
    });

    it("--limit を指定してコメント一覧を取得する", async () => {
      await program.parseAsync(["node", "test", "comment", "list", "PRJ-1", "--limit", "5"]);

      expect(mockIssueService.listComments).toHaveBeenCalledWith("PRJ-1", {
        count: 5,
      });
    });

    it("--json でJSON出力する", async () => {
      await program.parseAsync(["node", "test", "comment", "list", "PRJ-1", "--json"]);

      const calls = (console.log as any).mock.calls;
      const jsonOutput = calls[0][0];
      expect(() => JSON.parse(jsonOutput)).not.toThrow();
    });

    it("0件の場合メッセージを表示する", async () => {
      mockIssueService.listComments.mockResolvedValue([]);

      await program.parseAsync(["node", "test", "comment", "list", "PRJ-1"]);

      const output = (console.log as any).mock.calls[0][0];
      expect(output).toContain("コメントが見つかりません");
    });

    it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
      mockIssueService.listComments.mockRejectedValue(new Error("コメント取得に失敗しました"));
      const originalExitCode = process.exitCode;

      await program.parseAsync(["node", "test", "comment", "list", "PRJ-1"]);

      expect(console.error).toHaveBeenCalledWith("コメント取得に失敗しました");
      expect(process.exitCode).toBe(1);
      process.exitCode = originalExitCode;
    });
  });
});
