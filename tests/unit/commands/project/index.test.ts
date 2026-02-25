import { describe, it, expect, vi } from "vitest";
import { createProjectCommand } from "../../../../src/commands/project/index.js";

describe("createProjectCommand", () => {
  it("project コマンドを作成して list サブコマンドが登録されている", () => {
    const mockProjectService = {
      list: vi.fn(),
    } as any;

    const command = createProjectCommand(mockProjectService);

    expect(command.name()).toBe("project");
    const subcommands = command.commands.map((c) => c.name());
    expect(subcommands).toContain("list");
  });
});
