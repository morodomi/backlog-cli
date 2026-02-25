import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerProjectCategoriesCommand } from "../../../../src/commands/project/categories.js";

describe("project categories command", () => {
  let program: Command;
  let mockProjectService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockProjectService = {
      getCategories: vi.fn().mockResolvedValue([
        { id: 1, name: "フロントエンド", displayOrder: 0 },
        { id: 2, name: "バックエンド", displayOrder: 1 },
      ]),
    };
    registerProjectCategoriesCommand(program, mockProjectService);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("プロジェクトのカテゴリ一覧を表示する", async () => {
    await program.parseAsync(["node", "test", "categories", "PRJ"]);

    expect(mockProjectService.getCategories).toHaveBeenCalledWith("PRJ");
    expect(console.log).toHaveBeenCalled();
    const output = (console.log as any).mock.calls[0][0];
    expect(output).toContain("フロントエンド");
    expect(output).toContain("バックエンド");
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync(["node", "test", "categories", "PRJ", "--json"]);

    const output = (console.log as any).mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    mockProjectService.getCategories.mockRejectedValue(new Error("API error"));
    const originalExitCode = process.exitCode;

    await program.parseAsync(["node", "test", "categories", "PRJ"]);

    expect(console.error).toHaveBeenCalledWith("API error");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});
