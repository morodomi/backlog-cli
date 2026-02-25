import type { Entity } from "backlog-js";

export function formatProjectTable(projects: Entity.Project.Project[]): string {
  if (projects.length === 0) {
    return "プロジェクトが見つかりません";
  }

  const header = padEnd("Key", 16) + padEnd("Name", 40) + "Archived";
  const separator = "-".repeat(header.length);
  const rows = projects.map(
    (p) => padEnd(p.projectKey, 16) + padEnd(p.name, 40) + (p.archived ? "Yes" : "No"),
  );

  return [header, separator, ...rows].join("\n");
}

export function formatIssueTable(issues: Entity.Issue.Issue[]): string {
  if (issues.length === 0) {
    return "課題が見つかりません";
  }

  const header = padEnd("Key", 14) + padEnd("Status", 12) + padEnd("Assignee", 16) + "Summary";
  const separator = "-".repeat(80);
  const rows = issues.map(
    (i) =>
      padEnd(i.issueKey, 14) +
      padEnd(i.status.name, 12) +
      padEnd(i.assignee?.name ?? "-", 16) +
      i.summary,
  );

  return [header, separator, ...rows].join("\n");
}

function padEnd(str: string, len: number): string {
  if (str.length >= len) return str + " ";
  return str + " ".repeat(len - str.length);
}
