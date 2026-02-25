import { describe, it, expect, vi } from "vitest";
import { IssueService } from "../../../src/services/issue.service.js";
import { createIssueFixture } from "../../helpers/fixtures.js";

describe("IssueService", () => {
  describe("list", () => {
    it("プロジェクトキーから課題一覧を取得する", async () => {
      const issues = [
        createIssueFixture({ issueKey: "PRJ-1", summary: "課題1" }),
        createIssueFixture({ issueKey: "PRJ-2", summary: "課題2" }),
      ];
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssues: vi.fn().mockResolvedValue(issues),
      };
      const service = new IssueService(mockClient as any);

      const result = await service.list({ projectKey: "PRJ" });
      expect(result).toEqual(issues);
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ projectId: [100] }),
      );
    });

    it("limitを指定できる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssues: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      await service.list({ projectKey: "PRJ", limit: 5 });
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ count: 5 }),
      );
    });

    it("statusIdでフィルタできる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssues: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      await service.list({ projectKey: "PRJ", statusId: [1, 2] });
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ statusId: [1, 2] }),
      );
    });

    it("assigneeIdでフィルタできる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssues: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      await service.list({ projectKey: "PRJ", assigneeId: [5] });
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ assigneeId: [5] }),
      );
    });
  });

  describe("getStatuses", () => {
    it("プロジェクトのステータス一覧を取得する", async () => {
      const statuses = [
        { id: 1, projectId: 100, name: "未対応", color: "#ea2c00" as const, displayOrder: 0 },
        { id: 2, projectId: 100, name: "処理中", color: "#e87758" as const, displayOrder: 1 },
      ];
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getProjectStatuses: vi.fn().mockResolvedValue(statuses),
      };
      const service = new IssueService(mockClient as any);

      const result = await service.getStatuses("PRJ");
      expect(result).toEqual(statuses);
    });
  });

  describe("resolveStatusIds", () => {
    it("ステータス名からIDに変換する", async () => {
      const statuses = [
        { id: 1, projectId: 100, name: "未対応", color: "#ea2c00" as const, displayOrder: 0 },
        { id: 2, projectId: 100, name: "処理中", color: "#e87758" as const, displayOrder: 1 },
        { id: 3, projectId: 100, name: "処理済み", color: "#868cb7" as const, displayOrder: 2 },
        { id: 4, projectId: 100, name: "完了", color: "#3b9dbd" as const, displayOrder: 3 },
      ];
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getProjectStatuses: vi.fn().mockResolvedValue(statuses),
      };
      const service = new IssueService(mockClient as any);

      const ids = await service.resolveStatusIds("PRJ", ["未対応", "処理中"]);
      expect(ids).toEqual([1, 2]);
    });
  });
});
