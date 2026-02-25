import { describe, it, expect } from "vitest";
import { formatIssueTable } from "../../../src/formatters/table.formatter.js";
import { createIssueFixture } from "../../helpers/fixtures.js";

describe("formatIssueTable", () => {
  it("課題一覧をテーブル形式で返す", () => {
    const issues = [
      createIssueFixture({ issueKey: "PRJ-1", summary: "課題1" }),
      createIssueFixture({ issueKey: "PRJ-2", summary: "課題2", assignee: undefined }),
    ];

    const result = formatIssueTable(issues);

    expect(result).toContain("PRJ-1");
    expect(result).toContain("課題1");
    expect(result).toContain("PRJ-2");
    expect(result).toContain("課題2");
    expect(result).toContain("-"); // assignee undefined -> "-"
  });

  it("空の課題一覧に対して空メッセージを返す", () => {
    const result = formatIssueTable([]);
    expect(result).toContain("課題が見つかりません");
  });
});
