import type { Command } from "commander";
import type { IssueService, IssueUpdateOptions } from "../../services/issue.service.js";
import { formatIssueUpdated } from "../../formatters/detail.formatter.js";
import { handleCommandError } from "../../errors/index.js";

interface IssueUpdateCommandOptions {
  status?: string;
  assignee?: string;
  priority?: string;
  type?: string;
  category?: string[];
  milestone?: string[];
  comment?: string;
  startDate?: string;
  dueDate?: string;
  parent?: string;
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
    .option("--start-date <date>", "開始日 (YYYY-MM-DD)")
    .option("--due-date <date>", "期限日 (YYYY-MM-DD)")
    .option("--parent <issueKey>", "親課題キー (none で解除)")
    .option("--json", "JSON形式で出力する")
    .action(async (issueKey: string, options: IssueUpdateCommandOptions) => {
      try {
        const isValidDate = (value: string): boolean => {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
          const date = new Date(value);
          return !isNaN(date.getTime()) && date.toISOString().startsWith(value);
        };
        if (options.startDate && !isValidDate(options.startDate)) {
          console.error(`有効な日付を YYYY-MM-DD 形式で指定してください: ${options.startDate}`);
          process.exitCode = 1;
          return;
        }
        if (options.dueDate && !isValidDate(options.dueDate)) {
          console.error(`有効な日付を YYYY-MM-DD 形式で指定してください: ${options.dueDate}`);
          process.exitCode = 1;
          return;
        }

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
        if (options.startDate) {
          updateOptions.startDate = options.startDate;
        }
        if (options.dueDate) {
          updateOptions.dueDate = options.dueDate;
        }
        if (options.parent) {
          updateOptions.parentIssueKey = options.parent;
        }

        const issue = await issueService.update(issueKey, updateOptions);

        if (options.json) {
          console.log(JSON.stringify(issue, null, 2));
        } else {
          console.log(formatIssueUpdated(issue));
        }
      } catch (e) {
        handleCommandError(e);
      }
    });
}
