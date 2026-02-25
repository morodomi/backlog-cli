import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { registerProjectMembersCommand } from "../../../../src/commands/project/members.js";

describe("project members command", () => {
  let program: Command;
  let mockProjectService: any;

  beforeEach(() => {
    program = new Command();
    program.exitOverride();
    mockProjectService = {
      getMembers: vi.fn().mockResolvedValue([
        {
          id: 1,
          userId: "user1",
          name: "ユーザー1",
          roleType: 1,
          lang: "ja",
          mailAddress: "",
          lastLoginTime: "",
        },
        {
          id: 2,
          userId: "user2",
          name: "ユーザー2",
          roleType: 2,
          lang: "ja",
          mailAddress: "",
          lastLoginTime: "",
        },
      ]),
    };
    registerProjectMembersCommand(program, mockProjectService);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("プロジェクトのメンバー一覧を表示する", async () => {
    await program.parseAsync(["node", "test", "members", "PRJ"]);

    expect(mockProjectService.getMembers).toHaveBeenCalledWith("PRJ");
    expect(console.log).toHaveBeenCalled();
    const output = (console.log as any).mock.calls[0][0];
    expect(output).toContain("ユーザー1");
    expect(output).toContain("ユーザー2");
  });

  it("--json でJSON出力する", async () => {
    await program.parseAsync(["node", "test", "members", "PRJ", "--json"]);

    const output = (console.log as any).mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it("API呼び出し失敗時にエラーメッセージを表示して exitCode=1", async () => {
    mockProjectService.getMembers.mockRejectedValue(new Error("API error"));
    const originalExitCode = process.exitCode;

    await program.parseAsync(["node", "test", "members", "PRJ"]);

    expect(console.error).toHaveBeenCalledWith("API error");
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExitCode;
  });
});
