import { describe, it, expect } from "vitest";
import {
  formatIssueDetail,
  formatIssueCreated,
  formatIssueUpdated,
  formatCommentCreated,
} from "../../../src/formatters/detail.formatter.js";
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
    expect(result).toContain("Assignee:  -");
  });

  it("dueDate がない場合に Due Date 行が出力されない", () => {
    const issue = createIssueFixture({
      issueKey: "PRJ-789",
      dueDate: undefined,
    });

    const result = formatIssueDetail(issue);
    expect(result).not.toContain("Due Date:");
  });

  it("assignee が null の場合 '-' を表示する", () => {
    const issue = createIssueFixture({
      issueKey: "PRJ-101",
      assignee: null as unknown as undefined,
    });

    const result = formatIssueDetail(issue);
    expect(result).toContain("Assignee:  -");
  });

  it("description が空文字の場合 '(なし)' を表示する", () => {
    const issue = createIssueFixture({
      issueKey: "PRJ-102",
      description: "",
    });

    const result = formatIssueDetail(issue);
    expect(result).toContain("(なし)");
  });
});

describe("formatIssueCreated", () => {
  it("作成結果をフォーマットする", () => {
    const issue = createIssueFixture({
      issueKey: "PRJ-10",
      summary: "新しい課題",
    });

    const result = formatIssueCreated(issue);

    expect(result).toContain("作成しました");
    expect(result).toContain("PRJ-10");
    expect(result).toContain("新しい課題");
  });
});

describe("formatIssueUpdated", () => {
  it("更新結果をフォーマットする", () => {
    const issue = createIssueFixture({
      issueKey: "PRJ-1",
      summary: "更新済みの課題",
    });

    const result = formatIssueUpdated(issue);

    expect(result).toContain("更新しました");
    expect(result).toContain("PRJ-1");
    expect(result).toContain("更新済みの課題");
  });
});

describe("formatCommentCreated", () => {
  it("コメント追加結果をフォーマットする", () => {
    const comment = {
      id: 1,
      content: "テストコメント内容",
      changeLog: [],
      createdUser: { id: 1, name: "テストユーザー" },
      created: "2024-01-01T00:00:00Z",
      updated: "2024-01-01T00:00:00Z",
      stars: [],
      notifications: [],
    };

    const result = formatCommentCreated("PRJ-1", comment as any);

    expect(result).toContain("コメントを追加しました");
    expect(result).toContain("PRJ-1");
    expect(result).toContain("テストコメント内容");
  });
});
