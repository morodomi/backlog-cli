import type { Command } from "commander";
import type { ProjectService } from "../../services/project.service.js";
import { formatMemberTable } from "../../formatters/table.formatter.js";
import { handleCommandError } from "../../errors/index.js";

export function registerProjectMembersCommand(
  program: Command,
  projectService: ProjectService,
): void {
  program
    .command("members <projectKey>")
    .description("プロジェクトのメンバー一覧を表示する")
    .option("--json", "JSON形式で出力する")
    .action(async (projectKey: string, options: { json?: boolean }) => {
      try {
        const members = await projectService.getMembers(projectKey);

        if (options.json) {
          console.log(JSON.stringify(members, null, 2));
        } else {
          console.log(formatMemberTable(members));
        }
      } catch (e) {
        handleCommandError(e);
      }
    });
}
