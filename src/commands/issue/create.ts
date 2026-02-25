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
    .option("--json", "JSON形式で出力する")
    .action(async (options: IssueCreateCommandOptions) => {
      try {
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
