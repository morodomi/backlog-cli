import type { Command } from "commander";
import type { IssueService } from "../../services/issue.service.js";
import { formatIssueDetail } from "../../formatters/detail.formatter.js";

export function registerIssueViewCommand(
  program: Command,
  issueService: IssueService,
): void {
  program
    .command("view <issueKey>")
    .description("課題の詳細を表示する")
    .option("--json", "JSON形式で出力する")
    .action(async (issueKey: string, options: { json?: boolean }) => {
      const issue = await issueService.view(issueKey);

      if (options.json) {
        console.log(JSON.stringify(issue, null, 2));
      } else {
        console.log(formatIssueDetail(issue));
      }
    });
}
