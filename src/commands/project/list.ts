import type { Command } from "commander";
import type { ProjectService } from "../../services/project.service.js";
import { formatProjectTable } from "../../formatters/table.formatter.js";

export function registerProjectListCommand(program: Command, projectService: ProjectService): void {
  program
    .command("list")
    .description("プロジェクト一覧を表示する")
    .option("--archived", "アーカイブ済みプロジェクトを含める")
    .option("--json", "JSON形式で出力する")
    .action(async (options: { archived?: boolean; json?: boolean }) => {
      try {
        const params: Record<string, boolean> = {};
        if (options.archived) {
          params["archived"] = true;
        }
        const projects = await projectService.list(params);

        if (options.json) {
          console.log(JSON.stringify(projects, null, 2));
        } else {
          console.log(formatProjectTable(projects));
        }
      } catch (e) {
        console.error(e instanceof Error ? e.message : String(e));
        process.exitCode = 1;
      }
    });
}
