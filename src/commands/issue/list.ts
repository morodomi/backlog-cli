import type { Command } from "commander";
import type { IssueService, IssueListOptions } from "../../services/issue.service.js";
import { formatIssueTable } from "../../formatters/table.formatter.js";
import { handleCommandError } from "../../errors/index.js";
import { parseLimit } from "../helpers.js";

interface IssueListCommandOptions {
  project: string;
  status?: string[];
  type?: string[];
  category?: string[];
  milestone?: string[];
  assignee?: string[];
  priority?: string[];
  keyword?: string;
  sort?: string;
  order?: "asc" | "desc";
  limit?: number;
  json?: boolean;
}

export function registerIssueListCommand(program: Command, issueService: IssueService): void {
  program
    .command("list")
    .description("課題一覧を表示する")
    .requiredOption("-p, --project <projectKey>", "プロジェクトキー")
    .option("--status <status...>", "ステータスでフィルタ")
    .option("--type <type...>", "種別でフィルタ")
    .option("--category <category...>", "カテゴリでフィルタ")
    .option("--milestone <milestone...>", "マイルストーンでフィルタ")
    .option("--assignee <assignee...>", "担当者でフィルタ")
    .option("--priority <priority...>", "優先度でフィルタ")
    .option("--keyword <text>", "キーワード検索")
    .option("--sort <key>", "ソートキー")
    .option("--order <order>", "ソート順 (asc|desc)")
    .option("--limit <number>", "取得件数", parseLimit)
    .option("--json", "JSON形式で出力する")
    .action(async (options: IssueListCommandOptions) => {
      try {
        const listOptions: IssueListOptions = {
          projectKey: options.project,
        };

        if (options.status) {
          listOptions.statusId = await issueService.resolveStatusIds(
            options.project,
            options.status,
          );
        }
        if (options.type) {
          listOptions.issueTypeId = await issueService.resolveIssueTypeIds(
            options.project,
            options.type,
          );
        }
        if (options.category) {
          listOptions.categoryId = await issueService.resolveCategoryIds(
            options.project,
            options.category,
          );
        }
        if (options.milestone) {
          listOptions.milestoneId = await issueService.resolveMilestoneIds(
            options.project,
            options.milestone,
          );
        }
        if (options.assignee) {
          listOptions.assigneeId = await issueService.resolveAssigneeIds(
            options.project,
            options.assignee,
          );
        }
        if (options.priority) {
          listOptions.priorityId = await issueService.resolvePriorityIds(options.priority);
        }
        if (options.keyword) {
          listOptions.keyword = options.keyword;
        }
        if (options.sort) {
          listOptions.sort = options.sort;
        }
        if (options.order) {
          listOptions.order = options.order;
        }
        if (options.limit) {
          listOptions.limit = options.limit;
        }

        const issues = await issueService.list(listOptions);

        if (options.json) {
          console.log(JSON.stringify(issues, null, 2));
        } else {
          console.log(formatIssueTable(issues));
        }
      } catch (e) {
        handleCommandError(e);
      }
    });
}
