import type { Command } from "commander";
import type { ProjectService } from "../../services/project.service.js";
import { formatVersionTable } from "../../formatters/table.formatter.js";
import { handleCommandError } from "../../errors/index.js";

export function registerProjectMilestonesCommand(
  program: Command,
  projectService: ProjectService,
): void {
  program
    .command("milestones <projectKey>")
    .description("プロジェクトのマイルストーン一覧を表示する")
    .option("--json", "JSON形式で出力する")
    .action(async (projectKey: string, options: { json?: boolean }) => {
      try {
        const versions = await projectService.getVersions(projectKey);

        if (options.json) {
          console.log(JSON.stringify(versions, null, 2));
        } else {
          console.log(formatVersionTable(versions));
        }
      } catch (e) {
        handleCommandError(e);
      }
    });
}
