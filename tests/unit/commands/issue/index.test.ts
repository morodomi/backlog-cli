import { describe, it, expect, vi } from "vitest";
import { createIssueCommand } from "../../../../src/commands/issue/index.js";

describe("createIssueCommand", () => {
  it("issue コマンドを作成して list, view サブコマンドが登録されている", () => {
    const mockIssueService = {
      list: vi.fn(),
      view: vi.fn(),
      getStatuses: vi.fn(),
      resolveStatusIds: vi.fn(),
    } as any;

    const command = createIssueCommand(mockIssueService);

    expect(command.name()).toBe("issue");
    const subcommands = command.commands.map((c) => c.name());
    expect(subcommands).toContain("list");
    expect(subcommands).toContain("view");
  });
});
