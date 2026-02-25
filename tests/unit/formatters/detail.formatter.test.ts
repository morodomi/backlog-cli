import { describe, it, expect } from "vitest";
import { formatIssueDetail } from "../../../src/formatters/detail.formatter.js";
import { createIssueFixture } from "../../helpers/fixtures.js";

describe("formatIssueDetail", () => {
  it("課題詳細をフォーマットして返す", () => {
    const issue = createIssueFixture({
      issueKey: "PRJ-123",
      summary: "テスト課題の概要",
      description: "ここに詳細が入ります。",
    });

    const result = formatIssueDetail(issue);

    expect(result).toContain("PRJ-123");
    expect(result).toContain("テスト課題の概要");
    expect(result).toContain("ここに詳細が入ります。");
    expect(result).toContain("未対応"); // status.name
    expect(result).toContain("テストユーザー"); // assignee.name
    expect(result).toContain("中"); // priority.name
  });

  it("担当者が未設定の場合 '-' を表示する", () => {
    const issue = createIssueFixture({
      issueKey: "PRJ-456",
      assignee: undefined,
    });

    const result = formatIssueDetail(issue);
    expect(result).toContain("-");
  });
});
