import { describe, it, expect } from "vitest";
import {
  formatProjectTable,
  formatStatusTable,
  formatIssueTypeTable,
  formatCategoryTable,
  formatVersionTable,
  formatMemberTable,
  formatCommentTable,
} from "../../../src/formatters/table.formatter.js";
import { createProjectFixture } from "../../helpers/fixtures.js";

describe("formatProjectTable", () => {
  it("プロジェクト一覧をテーブル形式の文字列で返す", () => {
    const projects = [
      createProjectFixture({ projectKey: "PRJ1", name: "プロジェクト1" }),
      createProjectFixture({ projectKey: "PRJ2", name: "プロジェクト2" }),
    ];

    const result = formatProjectTable(projects);

    expect(result).toContain("PRJ1");
    expect(result).toContain("プロジェクト1");
    expect(result).toContain("PRJ2");
    expect(result).toContain("プロジェクト2");
  });

  it("空のプロジェクト一覧に対して空メッセージを返す", () => {
    const result = formatProjectTable([]);
    expect(result).toContain("プロジェクトが見つかりません");
  });
});

describe("formatStatusTable", () => {
  it("ステータス一覧をテーブル形式で返す", () => {
    const statuses = [
      { id: 1, projectId: 100, name: "未対応", color: "#ea2c00" as const, displayOrder: 0 },
      { id: 2, projectId: 100, name: "処理中", color: "#e87758" as const, displayOrder: 1 },
    ];

    const result = formatStatusTable(statuses);
    expect(result).toContain("Name");
    expect(result).toContain("Color");
    expect(result).toContain("未対応");
    expect(result).toContain("#ea2c00");
    expect(result).toContain("処理中");
  });

  it("空の場合メッセージを返す", () => {
    const result = formatStatusTable([]);
    expect(result).toContain("ステータスが見つかりません");
  });
});

describe("formatIssueTypeTable", () => {
  it("種別一覧をテーブル形式で返す", () => {
    const types = [
      { id: 1, projectId: 100, name: "タスク", color: "#7ea800", displayOrder: 0 },
      { id: 2, projectId: 100, name: "バグ", color: "#e07b9a", displayOrder: 1 },
    ];

    const result = formatIssueTypeTable(types);
    expect(result).toContain("Name");
    expect(result).toContain("Color");
    expect(result).toContain("タスク");
    expect(result).toContain("バグ");
  });

  it("空の場合メッセージを返す", () => {
    const result = formatIssueTypeTable([]);
    expect(result).toContain("種別が見つかりません");
  });
});

describe("formatCategoryTable", () => {
  it("カテゴリ一覧をテーブル形式で返す", () => {
    const categories = [
      { id: 1, name: "フロントエンド", displayOrder: 0 },
      { id: 2, name: "バックエンド", displayOrder: 1 },
    ];

    const result = formatCategoryTable(categories);
    expect(result).toContain("Name");
    expect(result).toContain("フロントエンド");
    expect(result).toContain("バックエンド");
  });

  it("空の場合メッセージを返す", () => {
    const result = formatCategoryTable([]);
    expect(result).toContain("カテゴリが見つかりません");
  });
});

describe("formatVersionTable", () => {
  it("バージョン一覧をテーブル形式で返す", () => {
    const versions = [
      {
        id: 1,
        projectId: 100,
        name: "v1.0",
        description: "",
        startDate: "2024-01-01",
        releaseDueDate: "2024-03-31",
        archived: false,
        displayOrder: 0,
      },
      {
        id: 2,
        projectId: 100,
        name: "v2.0",
        description: "",
        startDate: null,
        releaseDueDate: null,
        archived: true,
        displayOrder: 1,
      },
    ];

    const result = formatVersionTable(versions);
    expect(result).toContain("Name");
    expect(result).toContain("StartDate");
    expect(result).toContain("ReleaseDueDate");
    expect(result).toContain("Archived");
    expect(result).toContain("v1.0");
    expect(result).toContain("2024-01-01");
    expect(result).toContain("2024-03-31");
    expect(result).toContain("No");
    expect(result).toContain("v2.0");
    expect(result).toContain("Yes");
  });

  it("空の場合メッセージを返す", () => {
    const result = formatVersionTable([]);
    expect(result).toContain("バージョンが見つかりません");
  });
});

describe("formatMemberTable", () => {
  it("メンバー一覧をテーブル形式で返す", () => {
    const members = [
      {
        id: 1,
        userId: "user1",
        name: "ユーザー1",
        roleType: 1,
        lang: "ja",
        mailAddress: "",
        lastLoginTime: "",
      },
      {
        id: 2,
        userId: "user2",
        name: "ユーザー2",
        roleType: 2,
        lang: "ja",
        mailAddress: "",
        lastLoginTime: "",
      },
    ];

    const result = formatMemberTable(members);
    expect(result).toContain("Name");
    expect(result).toContain("UserId");
    expect(result).toContain("Role");
    expect(result).toContain("ユーザー1");
    expect(result).toContain("user1");
    expect(result).toContain("ユーザー2");
  });

  it("空の場合メッセージを返す", () => {
    const result = formatMemberTable([]);
    expect(result).toContain("メンバーが見つかりません");
  });
});

describe("formatCommentTable", () => {
  it("コメント一覧をテーブル形式で返す", () => {
    // Given: Comment 配列
    const comments = [
      {
        id: 1,
        content: "最初のコメント",
        changeLog: [],
        createdUser: { id: 1, name: "山田太郎" },
        created: "2024-01-15T10:30:00Z",
        updated: "2024-01-15T10:30:00Z",
        stars: [],
        notifications: [],
      },
      {
        id: 2,
        content: "2つ目のコメント",
        changeLog: [],
        createdUser: { id: 2, name: "鈴木花子" },
        created: "2024-01-16T14:00:00Z",
        updated: "2024-01-16T14:00:00Z",
        stars: [],
        notifications: [],
      },
    ];

    // When: formatCommentTable を呼ぶ
    const result = formatCommentTable(comments as any);

    // Then: ヘッダとデータ行が含まれる
    expect(result).toContain("Author");
    expect(result).toContain("Date");
    expect(result).toContain("Content");
    expect(result).toContain("山田太郎");
    expect(result).toContain("最初のコメント");
    expect(result).toContain("鈴木花子");
    expect(result).toContain("2つ目のコメント");
  });

  it("空配列の場合メッセージを返す", () => {
    // Given: 空配列
    // When: formatCommentTable を呼ぶ
    const result = formatCommentTable([]);

    // Then: 空メッセージ
    expect(result).toBe("コメントが見つかりません");
  });
});
