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
});
