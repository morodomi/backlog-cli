import type { Command } from "commander";
import type { IssueService } from "../../services/issue.service.js";
import { formatCommentCreated } from "../../formatters/detail.formatter.js";

interface IssueCommentCommandOptions {
  content: string;
  json?: boolean;
}

export function registerIssueCommentCommand(program: Command, issueService: IssueService): void {
  program
    .command("comment <issueKey>")
    .description("課題にコメントを追加する")
    .requiredOption("--content <content>", "コメント本文")
    .option("--json", "JSON形式で出力する")
    .action(async (issueKey: string, options: IssueCommentCommandOptions) => {
      try {
        const comment = await issueService.comment(issueKey, options.content);

        if (options.json) {
          console.log(JSON.stringify(comment, null, 2));
        } else {
          console.log(formatCommentCreated(issueKey, comment));
        }
      } catch (e) {
        console.error(e instanceof Error ? e.message : String(e));
        process.exitCode = 1;
      }
    });
}
