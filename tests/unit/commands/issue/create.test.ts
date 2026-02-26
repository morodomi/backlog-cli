import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerIssueCreateCommand } from "../../../../src/commands/issue/create.js";
import { createIssueFixture } from "../../../helpers/fixtures.js";

describe("issue create command", () => {
  let program: Command;
  let mockIssueService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockIssueService = {
      create: vi
        .fn()
        .mockResolvedValue(createIssueFixture({ issueKey: "PRJ-10", summary: "新しい課題" })),
    };
    registerIssueCreateCommand(program, mockIssueService);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("必須オプションで課題を作成する", async () => {
    await program.parseAsync([
      "node",
      "test",
      "create",
      "-p",
      "PRJ",
      "--summary",
      "新しい課題",
      "--type",
      "タスク",
      "--priority",
      "中",
    ]);

    expect(mockIssueService.create).toHaveBeenCalledWith({
      projectKey: "PRJ",
      summary: "新しい課題",
      issueTypeName: "タスク",
      priorityName: "中",
    });
    expect(console.log).toHaveBeenCalled();
  });

  it("オプションフィールドを指定して課題を作成する", async () => {
    await program.parseAsync([
      "node",
      "test",
      "create",
      "-p",
      "PRJ",
      "--summary",
      "詳細な課題",
      "--type",
      "タスク",
      "--priority",
      "中",
      "--description",
      "説明文",
      "--assignee",
      "山田太郎",
      "--category",
      "フロントエンド",
      "--milestone",
      "v1.0",
    ]);

    expect(mockIssueService.create).toHaveBeenCalledWith({
      projectKey: "PRJ",
      summary: "詳細な課題",
      issueTypeName: "タスク",
      priorityName: "中",
      description: "説明文",
      assigneeName: "山田太郎",
      categoryNames: ["フロントエンド"],
      milestoneNames: ["v1.0"],
    });
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync([
      "node",
      "test",
      "create",
      "-p",
      "PRJ",
      "--summary",
      "テスト",
      "--type",
      "タスク",
      "--priority",
      "中",
      "--json",
    ]);

    const calls = (console.log as any).mock.calls;
    const jsonOutput = calls[0][0];
    expect(() => JSON.parse(jsonOutput)).not.toThrow();
  });

  it("必須オプション未指定でエラーになる", async () => {
    await expect(program.parseAsync(["node", "test", "create", "-p", "PRJ"])).rejects.toThrow();
  });

  it("--parent で親課題キーを指定できる", async () => {
    await program.parseAsync([
      "node",
      "test",
      "create",
      "-p",
      "PRJ",
      "--summary",
      "子課題",
      "--type",
      "タスク",
      "--priority",
      "中",
      "--parent",
      "PRJ-5",
    ]);

    expect(mockIssueService.create).toHaveBeenCalledWith({
      projectKey: "PRJ",
      summary: "子課題",
      issueTypeName: "タスク",
      priorityName: "中",
      parentIssueKey: "PRJ-5",
    });
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    mockIssueService.create.mockRejectedValue(new Error("作成に失敗しました"));
    const originalExitCode = process.exitCode;

    await program.parseAsync([
      "node",
      "test",
      "create",
      "-p",
      "PRJ",
      "--summary",
      "テスト",
      "--type",
      "タスク",
      "--priority",
      "中",
    ]);

    expect(console.error).toHaveBeenCalledWith("作成に失敗しました");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });

  // T6: --start-date でサービスに startDate が渡される
  it("--start-date 2026-03-01 でサービスに startDate が渡される", async () => {
    // Given: 必須オプションに加えて --start-date を指定する
    // When: コマンドを実行する
    await program.parseAsync([
      "node",
      "test",
      "create",
      "-p",
      "PRJ",
      "--summary",
      "開始日付きの課題",
      "--type",
      "タスク",
      "--priority",
      "中",
      "--start-date",
      "2026-03-01",
    ]);

    // Then: IssueService.create に startDate が渡される
    expect(mockIssueService.create).toHaveBeenCalledWith({
      projectKey: "PRJ",
      summary: "開始日付きの課題",
      issueTypeName: "タスク",
      priorityName: "中",
      startDate: "2026-03-01",
    });
  });

  // T7: --due-date でサービスに dueDate が渡される
  it("--due-date 2026-03-31 でサービスに dueDate が渡される", async () => {
    // Given: 必須オプションに加えて --due-date を指定する
    // When: コマンドを実行する
    await program.parseAsync([
      "node",
      "test",
      "create",
      "-p",
      "PRJ",
      "--summary",
      "期限日付きの課題",
      "--type",
      "タスク",
      "--priority",
      "中",
      "--due-date",
      "2026-03-31",
    ]);

    // Then: IssueService.create に dueDate が渡される
    expect(mockIssueService.create).toHaveBeenCalledWith({
      projectKey: "PRJ",
      summary: "期限日付きの課題",
      issueTypeName: "タスク",
      priorityName: "中",
      dueDate: "2026-03-31",
    });
  });

  // T8: 不正な日付形式 --start-date abc でエラーメッセージ表示
  it("不正な日付形式 --start-date abc でエラーメッセージを表示して exitCode=1", async () => {
    // Given: YYYY-MM-DD 形式でない日付文字列を --start-date に渡す
    const originalExitCode = process.exitCode;

    // When: コマンドを実行する
    await program.parseAsync([
      "node",
      "test",
      "create",
      "-p",
      "PRJ",
      "--summary",
      "テスト",
      "--type",
      "タスク",
      "--priority",
      "中",
      "--start-date",
      "abc",
    ]);

    // Then: console.error にバリデーションエラーが表示され process.exitCode が 1 になる
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("YYYY-MM-DD"));
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});
