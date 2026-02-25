import { describe, it, expect, vi } from "vitest";
import { createProjectCommand } from "../../../../src/commands/project/index.js";

describe("createProjectCommand", () => {
  it("project コマンドを作成して全サブコマンドが登録されている", () => {
    const mockProjectService = {
      list: vi.fn(),
      getStatuses: vi.fn(),
      getIssueTypes: vi.fn(),
      getCategories: vi.fn(),
      getVersions: vi.fn(),
      getMembers: vi.fn(),
    } as any;

    const command = createProjectCommand(mockProjectService);

    expect(command.name()).toBe("project");
    const subcommands = command.commands.map((c) => c.name());
    expect(subcommands).toContain("list");
    expect(subcommands).toContain("statuses");
    expect(subcommands).toContain("types");
    expect(subcommands).toContain("categories");
    expect(subcommands).toContain("milestones");
    expect(subcommands).toContain("members");
  });
});
