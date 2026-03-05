import type { Entity } from "backlog-js";

type RoleType = 1 | 2 | 3 | 4 | 5 | 6;

const ROLE_NAMES: Record<RoleType, string> = {
  1: "管理者",
  2: "一般",
  3: "レポーター",
  4: "ビューアー",
  5: "ゲストレポーター",
  6: "ゲストビューアー",
};

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

export function formatStatusTable(statuses: Entity.Project.ProjectStatus[]): string {
  if (statuses.length === 0) {
    return "ステータスが見つかりません";
  }

  const header = padEnd("Name", 20) + "Color";
  const separator = "-".repeat(header.length);
  const rows = statuses.map((s) => padEnd(s.name, 20) + s.color);

  return [header, separator, ...rows].join("\n");
}

export function formatIssueTypeTable(types: Entity.Issue.IssueType[]): string {
  if (types.length === 0) {
    return "種別が見つかりません";
  }

  const header = padEnd("Name", 20) + "Color";
  const separator = "-".repeat(header.length);
  const rows = types.map((t) => padEnd(t.name, 20) + t.color);

  return [header, separator, ...rows].join("\n");
}

export function formatCategoryTable(categories: Entity.Project.Category[]): string {
  if (categories.length === 0) {
    return "カテゴリが見つかりません";
  }

  const header = "Name";
  const separator = "-".repeat(30);
  const rows = categories.map((c) => c.name);

  return [header, separator, ...rows].join("\n");
}

export function formatVersionTable(versions: Entity.Project.Version[]): string {
  if (versions.length === 0) {
    return "バージョンが見つかりません";
  }

  const header =
    padEnd("Name", 20) + padEnd("StartDate", 14) + padEnd("ReleaseDueDate", 18) + "Archived";
  const separator = "-".repeat(header.length);
  const rows = versions.map(
    (v) =>
      padEnd(v.name, 20) +
      padEnd(v.startDate ?? "-", 14) +
      padEnd(v.releaseDueDate ?? "-", 18) +
      (v.archived ? "Yes" : "No"),
  );

  return [header, separator, ...rows].join("\n");
}

export function formatMemberTable(members: Entity.User.User[]): string {
  if (members.length === 0) {
    return "メンバーが見つかりません";
  }

  const header = padEnd("Name", 20) + padEnd("UserId", 20) + "Role";
  const separator = "-".repeat(header.length);
  const rows = members.map(
    (m) =>
      padEnd(m.name, 20) +
      padEnd(m.userId ?? "-", 20) +
      (ROLE_NAMES[m.roleType as RoleType] ?? String(m.roleType)),
  );

  return [header, separator, ...rows].join("\n");
}

export function formatCommentTable(comments: Entity.Issue.Comment[]): string {
  if (comments.length === 0) {
    return "コメントが見つかりません";
  }

  const header = padEnd("Author", 20) + padEnd("Date", 22) + "Content";
  const separator = "-".repeat(80);
  const rows = comments.map(
    (c) =>
      padEnd(c.createdUser.name, 20) +
      padEnd(c.created.replace("T", " ").replace("Z", ""), 22) +
      c.content,
  );

  return [header, separator, ...rows].join("\n");
}

function padEnd(str: string, len: number): string {
  if (str.length >= len) return str + " ";
  return str + " ".repeat(len - str.length);
}
