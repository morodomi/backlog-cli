import { Command } from "commander";
import type { IssueService } from "../../services/issue.service.js";
import { registerIssueListCommand } from "./list.js";
import { registerIssueViewCommand } from "./view.js";

export function createIssueCommand(issueService: IssueService): Command {
  const issue = new Command("issue").description("課題の管理");
  registerIssueListCommand(issue, issueService);
  registerIssueViewCommand(issue, issueService);
  return issue;
}
