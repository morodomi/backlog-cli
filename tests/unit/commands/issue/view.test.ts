import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerIssueViewCommand } from "../../../../src/commands/issue/view.js";
import { createIssueFixture } from "../../../helpers/fixtures.js";

describe("issue view command", () => {
  let program: Command;
  let mockIssueService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockIssueService = {
      view: vi
        .fn()
        .mockResolvedValue(createIssueFixture({ issueKey: "PRJ-123", summary: "テスト課題" })),
      getChildIssues: vi.fn().mockResolvedValue([]),
    };
    registerIssueViewCommand(program, mockIssueService);
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("課題キーを指定して詳細を表示する", async () => {
    await program.parseAsync(["node", "test", "view", "PRJ-123"]);

    expect(mockIssueService.view).toHaveBeenCalledWith("PRJ-123");
    expect(console.log).toHaveBeenCalled();
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync(["node", "test", "view", "PRJ-123", "--json"]);

    const calls = (console.log as any).mock.calls;
    const jsonOutput = calls[0][0];
    expect(() => JSON.parse(jsonOutput)).not.toThrow();
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockIssueService.view.mockRejectedValue(new Error("Issue not found"));
    const originalExitCode = process.exitCode;

    await program.parseAsync(["node", "test", "view", "PRJ-999"]);

    expect(console.error).toHaveBeenCalledWith("Issue not found");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});

describe("issue view command - 子課題表示", () => {
  let program: Command;
  let mockIssueService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockIssueService = {
      view: vi
        .fn()
        .mockResolvedValue(createIssueFixture({ issueKey: "PRJ-100", summary: "親課題" })),
      getChildIssues: vi.fn(),
    };
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // T7: 子課題がある場合、表示に子課題一覧が含まれる
  it("T7: 子課題がある場合、表示に子課題一覧が含まれる", async () => {
    // Given: getChildIssues が子課題を返す
    mockIssueService.getChildIssues = vi
      .fn()
      .mockResolvedValue([
        createIssueFixture({ issueKey: "PRJ-101", summary: "子課題1" }),
        createIssueFixture({ issueKey: "PRJ-102", summary: "子課題2" }),
      ]);
    registerIssueViewCommand(program, mockIssueService);

    // When: issue view を実行する
    await program.parseAsync(["node", "test", "view", "PRJ-100"]);

    // Then: console.log の出力に子課題キーが含まれる
    const output: string = (console.log as any).mock.calls.map((c: any[]) => c[0]).join("\n");
    expect(output).toContain("PRJ-101");
    expect(output).toContain("PRJ-102");
  });

  // T8: 子課題がない場合、子課題セクションが表示されない
  it("T8: 子課題がない場合、子課題セクションが表示されない", async () => {
    // Given: getChildIssues が空配列を返す
    mockIssueService.getChildIssues = vi.fn().mockResolvedValue([]);
    registerIssueViewCommand(program, mockIssueService);

    // When: issue view を実行する
    await program.parseAsync(["node", "test", "view", "PRJ-100"]);

    // Then: getChildIssues が呼ばれ、console.log の出力に "子課題" が含まれない
    expect(mockIssueService.getChildIssues).toHaveBeenCalledWith("PRJ-100");
    const output: string = (console.log as any).mock.calls.map((c: any[]) => c[0]).join("\n");
    expect(output).not.toContain("子課題");
  });
});
