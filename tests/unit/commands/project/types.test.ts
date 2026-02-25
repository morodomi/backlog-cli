import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerProjectTypesCommand } from "../../../../src/commands/project/types.js";

describe("project types command", () => {
  let program: Command;
  let mockProjectService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockProjectService = {
      getIssueTypes: vi.fn().mockResolvedValue([
        { id: 1, projectId: 100, name: "タスク", color: "#7ea800", displayOrder: 0 },
        { id: 2, projectId: 100, name: "バグ", color: "#e07b9a", displayOrder: 1 },
      ]),
    };
    registerProjectTypesCommand(program, mockProjectService);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("プロジェクトの種別一覧を表示する", async () => {
    await program.parseAsync(["node", "test", "types", "PRJ"]);

    expect(mockProjectService.getIssueTypes).toHaveBeenCalledWith("PRJ");
    expect(console.log).toHaveBeenCalled();
    const output = (console.log as any).mock.calls[0][0];
    expect(output).toContain("タスク");
    expect(output).toContain("バグ");
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync(["node", "test", "types", "PRJ", "--json"]);

    const output = (console.log as any).mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    mockProjectService.getIssueTypes.mockRejectedValue(new Error("API error"));
    const originalExitCode = process.exitCode;

    await program.parseAsync(["node", "test", "types", "PRJ"]);

    expect(console.error).toHaveBeenCalledWith("API error");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});
