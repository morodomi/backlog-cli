import { describe, it, expect } from "vitest";
import type { Entity } from "backlog-js";
import {
  formatIssueDetail,
  formatIssueCreated,
  formatIssueUpdated,
  formatCommentCreated,
} from "../../../src/formatters/detail.formatter.js";
import { createIssueFixture, createCommentFixture } from "../../helpers/fixtures.js";

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

  // T9: parentIssueId がある場合、Parent 行が表示される
  it("parentIssueId がある場合、Parent 行が表示される", () => {
    // Given: parentIssueId を持つ課題
    const issue = createIssueFixture({
      issueKey: "PRJ-200",
      parentIssueId: 123,
    });

    // When: 課題詳細をフォーマットする
    const result = formatIssueDetail(issue);

    // Then: Parent 行が出力に含まれる
    expect(result).toContain("Parent:");
    expect(result).toContain("123");
  });

  // T10: 子課題配列が渡された場合、子課題セクションが表示される
  it("子課題配列が渡された場合、子課題セクションが表示される", () => {
    // Given: 親課題と2件の子課題
    const issue = createIssueFixture({ issueKey: "PRJ-300" });
    const childIssue1 = createIssueFixture({
      issueKey: "PRJ-301",
      summary: "子課題1",
    });
    const childIssue2 = createIssueFixture({
      issueKey: "PRJ-302",
      summary: "子課題2",
    });

    // When: 子課題配列を第2引数に渡してフォーマットする
    const result = (
      formatIssueDetail as (issue: Entity.Issue.Issue, childIssues?: Entity.Issue.Issue[]) => string
    )(issue, [childIssue1, childIssue2]);

    // Then: 子課題セクションと各課題キーが出力に含まれる
    expect(result).toContain("Children:");
    expect(result).toContain("PRJ-301");
    expect(result).toContain("PRJ-302");
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
    const comment = createCommentFixture({ content: "テストコメント内容" });

    const result = formatCommentCreated("PRJ-1", comment);

    expect(result).toContain("コメントを追加しました");
    expect(result).toContain("PRJ-1");
    expect(result).toContain("テストコメント内容");
  });
});
