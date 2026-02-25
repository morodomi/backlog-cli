import { Command } from "commander";
import type { IssueService } from "../../services/issue.service.js";
import { registerIssueListCommand } from "./list.js";
import { registerIssueViewCommand } from "./view.js";
import { registerIssueCreateCommand } from "./create.js";
import { registerIssueUpdateCommand } from "./update.js";
import { registerIssueCommentCommand } from "./comment.js";

export function createIssueCommand(issueService: IssueService): Command {
  const issue = new Command("issue").description("課題の管理");
  registerIssueListCommand(issue, issueService);
  registerIssueViewCommand(issue, issueService);
  registerIssueCreateCommand(issue, issueService);
  registerIssueUpdateCommand(issue, issueService);
  registerIssueCommentCommand(issue, issueService);
  return issue;
}
