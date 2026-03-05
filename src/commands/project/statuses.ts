import type { Command } from "commander";
import type { ProjectService } from "../../services/project.service.js";
import { formatStatusTable } from "../../formatters/table.formatter.js";
import { handleCommandError } from "../../errors/index.js";

export function registerProjectStatusesCommand(
  program: Command,
  projectService: ProjectService,
): void {
  program
    .command("statuses <projectKey>")
    .description("プロジェクトのステータス一覧を表示する")
    .option("--json", "JSON形式で出力する")
    .action(async (projectKey: string, options: { json?: boolean }) => {
      try {
        const statuses = await projectService.getStatuses(projectKey);

        if (options.json) {
          console.log(JSON.stringify(statuses, null, 2));
        } else {
          console.log(formatStatusTable(statuses));
        }
      } catch (e) {
        handleCommandError(e);
      }
    });
}
