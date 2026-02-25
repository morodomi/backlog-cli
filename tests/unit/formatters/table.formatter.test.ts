import { describe, it, expect } from "vitest";
import { formatProjectTable } from "../../../src/formatters/table.formatter.js";
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
