import type { Command } from "commander";
import type { ProjectService } from "../../services/project.service.js";
import { formatIssueTypeTable } from "../../formatters/table.formatter.js";
import { handleCommandError } from "../../errors/index.js";

export function registerProjectTypesCommand(
  program: Command,
  projectService: ProjectService,
): void {
  program
    .command("types <projectKey>")
    .description("プロジェクトの種別一覧を表示する")
    .option("--json", "JSON形式で出力する")
    .action(async (projectKey: string, options: { json?: boolean }) => {
      try {
        const types = await projectService.getIssueTypes(projectKey);

        if (options.json) {
          console.log(JSON.stringify(types, null, 2));
        } else {
          console.log(formatIssueTypeTable(types));
        }
      } catch (e) {
        handleCommandError(e);
      }
    });
}
