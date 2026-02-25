import type { Command } from "commander";
import type { IssueService, IssueUpdateOptions } from "../../services/issue.service.js";
import { formatIssueUpdated } from "../../formatters/detail.formatter.js";

interface IssueUpdateCommandOptions {
  status?: string;
  assignee?: string;
  priority?: string;
  type?: string;
  category?: string[];
  milestone?: string[];
  comment?: string;
  json?: boolean;
}

export function registerIssueUpdateCommand(program: Command, issueService: IssueService): void {
  program
    .command("update <issueKey>")
    .description("課題を更新する")
    .option("--status <status>", "ステータス名")
    .option("--assignee <assignee>", "担当者名")
    .option("--priority <priority>", "優先度名")
    .option("--type <type>", "種別名")
    .option("--category <category...>", "カテゴリ名")
    .option("--milestone <milestone...>", "マイルストーン名")
    .option("--comment <comment>", "更新コメント")
    .option("--json", "JSON形式で出力する")
    .action(async (issueKey: string, options: IssueUpdateCommandOptions) => {
      try {
        const updateOptions: IssueUpdateOptions = {};

        if (options.status) {
          updateOptions.statusName = options.status;
        }
        if (options.assignee) {
          updateOptions.assigneeName = options.assignee;
        }
        if (options.priority) {
          updateOptions.priorityName = options.priority;
        }
        if (options.type) {
          updateOptions.issueTypeName = options.type;
        }
        if (options.category) {
          updateOptions.categoryNames = options.category;
        }
        if (options.milestone) {
          updateOptions.milestoneNames = options.milestone;
        }
        if (options.comment) {
          updateOptions.comment = options.comment;
        }

        const issue = await issueService.update(issueKey, updateOptions);

        if (options.json) {
          console.log(JSON.stringify(issue, null, 2));
        } else {
          console.log(formatIssueUpdated(issue));
        }
      } catch (e) {
        console.error(e instanceof Error ? e.message : String(e));
        process.exitCode = 1;
      }
    });
}
