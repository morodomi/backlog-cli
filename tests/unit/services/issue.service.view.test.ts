import { describe, it, expect, vi } from "vitest";
import { IssueService } from "../../../src/services/issue.service.js";
import { createIssueFixture } from "../../helpers/fixtures.js";

describe("IssueService.view", () => {
  it("課題キーで課題詳細を取得する", async () => {
    const issue = createIssueFixture({ issueKey: "PRJ-123", summary: "テスト課題" });
    const mockClient = {
      getIssue: vi.fn().mockResolvedValue(issue),
    };
    const service = new IssueService(mockClient as any);

    const result = await service.view("PRJ-123");
    expect(result).toEqual(issue);
    expect(mockClient.getIssue).toHaveBeenCalledWith("PRJ-123");
  });
});
