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
      view: vi.fn().mockResolvedValue(
        createIssueFixture({ issueKey: "PRJ-123", summary: "テスト課題" }),
      ),
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
});
