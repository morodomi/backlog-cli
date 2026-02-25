import type { Entity } from "backlog-js";

export function formatIssueDetail(issue: Entity.Issue.Issue): string {
  const lines = [
    `[${issue.issueKey}] ${issue.summary}`,
    "",
    `Status:    ${issue.status.name}`,
    `Priority:  ${issue.priority.name}`,
    `Assignee:  ${issue.assignee?.name ?? "-"}`,
    `Type:      ${issue.issueType.name}`,
    `Created:   ${issue.created}`,
    `Updated:   ${issue.updated}`,
  ];

  if (issue.dueDate) {
    lines.push(`Due Date:  ${issue.dueDate}`);
  }

  lines.push("", "--- Description ---", issue.description || "(なし)");

  return lines.join("\n");
}
