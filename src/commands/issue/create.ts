import type { Command } from "commander";
import type { IssueService, IssueCreateOptions } from "../../services/issue.service.js";
import { formatIssueCreated } from "../../formatters/detail.formatter.js";

interface IssueCreateCommandOptions {
  project: string;
  summary: string;
  type: string;
  priority: string;
  description?: string;
  assignee?: string;
  category?: string[];
  milestone?: string[];
  parent?: string;
  startDate?: string;
  dueDate?: string;
  json?: boolean;
}

export function registerIssueCreateCommand(program: Command, issueService: IssueService): void {
  program
    .command("create")
    .description("課題を作成する")
    .requiredOption("-p, --project <projectKey>", "プロジェクトキー")
    .requiredOption("--summary <summary>", "件名")
    .requiredOption("--type <type>", "種別名")
    .requiredOption("--priority <priority>", "優先度名")
    .option("--description <description>", "説明")
    .option("--assignee <assignee>", "担当者名")
    .option("--category <category...>", "カテゴリ名")
    .option("--milestone <milestone...>", "マイルストーン名")
    .option("--parent <issueKey>", "親課題キー")
    .option("--start-date <date>", "開始日 (YYYY-MM-DD)")
    .option("--due-date <date>", "期限日 (YYYY-MM-DD)")
    .option("--json", "JSON形式で出力する")
    .action(async (options: IssueCreateCommandOptions) => {
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

        const createOptions: IssueCreateOptions = {
          projectKey: options.project,
          summary: options.summary,
          issueTypeName: options.type,
          priorityName: options.priority,
        };

        if (options.description) {
          createOptions.description = options.description;
        }
        if (options.assignee) {
          createOptions.assigneeName = options.assignee;
        }
        if (options.category) {
          createOptions.categoryNames = options.category;
        }
        if (options.milestone) {
          createOptions.milestoneNames = options.milestone;
        }
        if (options.parent) {
          createOptions.parentIssueKey = options.parent;
        }
        if (options.startDate) {
          createOptions.startDate = options.startDate;
        }
        if (options.dueDate) {
          createOptions.dueDate = options.dueDate;
        }

        const issue = await issueService.create(createOptions);

        if (options.json) {
          console.log(JSON.stringify(issue, null, 2));
        } else {
          console.log(formatIssueCreated(issue));
        }
      } catch (e) {
        console.error(e instanceof Error ? e.message : String(e));
        process.exitCode = 1;
      }
    });
}
