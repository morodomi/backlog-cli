import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerProjectMilestonesCommand } from "../../../../src/commands/project/milestones.js";

describe("project milestones command", () => {
  let program: Command;
  let mockProjectService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockProjectService = {
      getVersions: vi.fn().mockResolvedValue([
        {
          id: 1,
          projectId: 100,
          name: "v1.0",
          description: "",
          startDate: "2024-01-01",
          releaseDueDate: "2024-03-31",
          archived: false,
          displayOrder: 0,
        },
        {
          id: 2,
          projectId: 100,
          name: "v2.0",
          description: "",
          startDate: null,
          releaseDueDate: null,
          archived: false,
          displayOrder: 1,
        },
      ]),
    };
    registerProjectMilestonesCommand(program, mockProjectService);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("プロジェクトのマイルストーン一覧を表示する", async () => {
    await program.parseAsync(["node", "test", "milestones", "PRJ"]);

    expect(mockProjectService.getVersions).toHaveBeenCalledWith("PRJ");
    expect(console.log).toHaveBeenCalled();
    const output = (console.log as any).mock.calls[0][0];
    expect(output).toContain("v1.0");
    expect(output).toContain("v2.0");
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync(["node", "test", "milestones", "PRJ", "--json"]);

    const output = (console.log as any).mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    mockProjectService.getVersions.mockRejectedValue(new Error("API error"));
    const originalExitCode = process.exitCode;

    await program.parseAsync(["node", "test", "milestones", "PRJ"]);

    expect(console.error).toHaveBeenCalledWith("API error");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});
