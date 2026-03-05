import { Command } from "commander";
import type { IssueService } from "../../services/issue.service.js";
import { formatCommentCreated } from "../../formatters/detail.formatter.js";
import { formatCommentTable } from "../../formatters/table.formatter.js";
import { handleCommandError } from "../../errors/index.js";
import { parseLimit } from "../helpers.js";

export function registerIssueCommentCommand(program: Command, issueService: IssueService): void {
  const comment = program.command("comment").description("課題コメントの管理");

  comment
    .command("add <issueKey>")
    .description("課題にコメントを追加する")
    .requiredOption("--content <content>", "コメント本文")
    .option("--json", "JSON形式で出力する")
    .action(async (issueKey: string, options: { content: string; json?: boolean }) => {
      try {
        const result = await issueService.comment(issueKey, options.content);

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(formatCommentCreated(issueKey, result));
        }
      } catch (e) {
        handleCommandError(e);
      }
    });

  comment
    .command("list <issueKey>")
    .description("課題のコメント一覧を表示する")
    .option("--limit <count>", "取得件数", parseLimit, 10)
    .option("--json", "JSON形式で出力する")
    .action(async (issueKey: string, options: { limit: number; json?: boolean }) => {
      try {
        const comments = await issueService.listComments(issueKey, {
          count: options.limit,
        });

        if (options.json) {
          console.log(JSON.stringify(comments, null, 2));
        } else {
          console.log(formatCommentTable(comments));
        }
      } catch (e) {
        handleCommandError(e);
      }
    });
}
