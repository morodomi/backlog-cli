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

  // T9: --start-date でサービスに startDate が渡される
  it("--start-date 2026-03-01 でサービスに startDate が渡される", async () => {
    // Given: 有効な日付形式 YYYY-MM-DD
    // When: --start-date オプション付きで update コマンドを実行する
    await program.parseAsync(["node", "test", "update", "PRJ-1", "--start-date", "2026-03-01"]);

    // Then: サービスの update に startDate が渡される
    expect(mockIssueService.update).toHaveBeenCalledWith("PRJ-1", {
      startDate: "2026-03-01",
    });
  });

  // T10: --due-date でサービスに dueDate が渡される
  it("--due-date 2026-03-31 でサービスに dueDate が渡される", async () => {
    // Given: 有効な日付形式 YYYY-MM-DD
    // When: --due-date オプション付きで update コマンドを実行する
    await program.parseAsync(["node", "test", "update", "PRJ-1", "--due-date", "2026-03-31"]);

    // Then: サービスの update に dueDate が渡される
    expect(mockIssueService.update).toHaveBeenCalledWith("PRJ-1", {
      dueDate: "2026-03-31",
    });
  });

  // T11: 不正な日付形式でエラーメッセージ表示
  it("不正な日付形式 --due-date 2026/03/31 でエラーメッセージを表示して exitCode=1", async () => {
    // Given: YYYY-MM-DD 形式でない日付（スラッシュ区切り）
    const originalExitCode = process.exitCode;

    // When: 不正な日付形式で --due-date を指定して update コマンドを実行する
    await program.parseAsync(["node", "test", "update", "PRJ-1", "--due-date", "2026/03/31"]);

    // Then: console.error が呼ばれ process.exitCode が 1 になる
    expect(console.error).toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });

  // T5: --parent PRJ-5 でサービスに parentIssueKey が渡される
  it("--parent PRJ-5 でサービスに parentIssueKey が渡される", async () => {
    // Given: 親課題キー PRJ-5 を指定する
    // When: --parent オプション付きで update コマンドを実行する
    await program.parseAsync(["node", "test", "update", "PRJ-1", "--parent", "PRJ-5"]);

    // Then: サービスの update に parentIssueKey が渡される
    expect(mockIssueService.update).toHaveBeenCalledWith("PRJ-1", {
      parentIssueKey: "PRJ-5",
    });
  });

  // T6: --parent none でサービスに parentIssueKey "none" が渡される
  it('--parent none でサービスに parentIssueKey "none" が渡される', async () => {
    // Given: 親課題解除を意味する "none" を指定する
    // When: --parent none で update コマンドを実行する
    await program.parseAsync(["node", "test", "update", "PRJ-1", "--parent", "none"]);

    // Then: サービスの update に parentIssueKey "none" が渡される
    expect(mockIssueService.update).toHaveBeenCalledWith("PRJ-1", {
      parentIssueKey: "none",
    });
  });
});
