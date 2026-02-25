import type { Command } from "commander";
import type { IssueService } from "../../services/issue.service.js";
import { formatIssueTable } from "../../formatters/table.formatter.js";

export function registerIssueListCommand(
  program: Command,
  issueService: IssueService,
): void {
  program
    .command("list")
    .description("課題一覧を表示する")
    .requiredOption("-p, --project <projectKey>", "プロジェクトキー")
    .option("--status <status...>", "ステータスでフィルタ")
    .option("--limit <number>", "取得件数", parseInt)
    .option("--json", "JSON形式で出力する")
    .action(
      async (options: {
        project: string;
        status?: string[];
        limit?: number;
        json?: boolean;
      }) => {
        const listOptions: Record<string, unknown> = {
          projectKey: options.project,
        };

        if (options.status) {
          const statusIds = await issueService.resolveStatusIds(
            options.project,
            options.status,
          );
          listOptions["statusId"] = statusIds;
        }

        if (options.limit) {
          listOptions["limit"] = options.limit;
        }

        const issues = await issueService.list(listOptions as any);

        if (options.json) {
          console.log(JSON.stringify(issues, null, 2));
        } else {
          console.log(formatIssueTable(issues));
        }
      },
    );
}
