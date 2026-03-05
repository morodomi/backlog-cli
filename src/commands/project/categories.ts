import type { Command } from "commander";
import type { ProjectService } from "../../services/project.service.js";
import { formatCategoryTable } from "../../formatters/table.formatter.js";
import { handleCommandError } from "../../errors/index.js";

export function registerProjectCategoriesCommand(
  program: Command,
  projectService: ProjectService,
): void {
  program
    .command("categories <projectKey>")
    .description("プロジェクトのカテゴリ一覧を表示する")
    .option("--json", "JSON形式で出力する")
    .action(async (projectKey: string, options: { json?: boolean }) => {
      try {
        const categories = await projectService.getCategories(projectKey);

        if (options.json) {
          console.log(JSON.stringify(categories, null, 2));
        } else {
          console.log(formatCategoryTable(categories));
        }
      } catch (e) {
        handleCommandError(e);
      }
    });
}
