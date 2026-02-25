import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerProjectStatusesCommand } from "../../../../src/commands/project/statuses.js";

describe("project statuses command", () => {
  let program: Command;
  let mockProjectService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockProjectService = {
      getStatuses: vi.fn().mockResolvedValue([
        { id: 1, projectId: 100, name: "未対応", color: "#ea2c00", displayOrder: 0 },
        { id: 2, projectId: 100, name: "処理中", color: "#e87758", displayOrder: 1 },
      ]),
    };
    registerProjectStatusesCommand(program, mockProjectService);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("プロジェクトのステータス一覧を表示する", async () => {
    await program.parseAsync(["node", "test", "statuses", "PRJ"]);

    expect(mockProjectService.getStatuses).toHaveBeenCalledWith("PRJ");
    expect(console.log).toHaveBeenCalled();
    const output = (console.log as any).mock.calls[0][0];
    expect(output).toContain("未対応");
    expect(output).toContain("処理中");
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync(["node", "test", "statuses", "PRJ", "--json"]);

    const output = (console.log as any).mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    mockProjectService.getStatuses.mockRejectedValue(new Error("API error"));
    const originalExitCode = process.exitCode;

    await program.parseAsync(["node", "test", "statuses", "PRJ"]);

    expect(console.error).toHaveBeenCalledWith("API error");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});
