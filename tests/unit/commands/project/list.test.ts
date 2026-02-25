import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerProjectListCommand } from "../../../../src/commands/project/list.js";

describe("project list command", () => {
  let program: Command;
  let mockProjectService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockProjectService = {
      list: vi.fn().mockResolvedValue([
        { projectKey: "PRJ1", name: "プロジェクト1", archived: false },
        { projectKey: "PRJ2", name: "プロジェクト2", archived: false },
      ]),
    };
    registerProjectListCommand(program, mockProjectService);
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("プロジェクト一覧を取得して表示する", async () => {
    await program.parseAsync(["node", "test", "list"]);

    expect(mockProjectService.list).toHaveBeenCalledWith({});
    expect(console.log).toHaveBeenCalled();
  });

  it("--archived でアーカイブ済みを含める", async () => {
    await program.parseAsync(["node", "test", "list", "--archived"]);

    expect(mockProjectService.list).toHaveBeenCalledWith({ archived: true });
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync(["node", "test", "list", "--json"]);

    const calls = (console.log as any).mock.calls;
    const jsonOutput = calls[0][0];
    expect(() => JSON.parse(jsonOutput)).not.toThrow();
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockProjectService.list.mockRejectedValue(new Error("Network error"));
    const originalExitCode = process.exitCode;

    await program.parseAsync(["node", "test", "list"]);

    expect(console.error).toHaveBeenCalledWith("Network error");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});
