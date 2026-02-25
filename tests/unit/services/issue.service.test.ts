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
      expect(mockClient.getIssues).toHaveBeenCalledWith(expect.objectContaining({ count: 5 }));
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

  describe("resolveIssueTypeIds", () => {
    it("種別名からIDに変換する", async () => {
      const issueTypes = [
        { id: 10, projectId: 100, name: "タスク", color: "#7ea800", displayOrder: 0 },
        { id: 11, projectId: 100, name: "バグ", color: "#e07b9a", displayOrder: 1 },
      ];
      const mockClient = {
        getIssueTypes: vi.fn().mockResolvedValue(issueTypes),
      };
      const service = new IssueService(mockClient as any);

      const ids = await service.resolveIssueTypeIds("PRJ", ["タスク"]);
      expect(ids).toEqual([10]);
      expect(mockClient.getIssueTypes).toHaveBeenCalledWith("PRJ");
    });

    it("見つからない名前は無視する", async () => {
      const issueTypes = [
        { id: 10, projectId: 100, name: "タスク", color: "#7ea800", displayOrder: 0 },
      ];
      const mockClient = {
        getIssueTypes: vi.fn().mockResolvedValue(issueTypes),
      };
      const service = new IssueService(mockClient as any);

      const ids = await service.resolveIssueTypeIds("PRJ", ["タスク", "存在しない"]);
      expect(ids).toEqual([10]);
    });
  });

  describe("resolveCategoryIds", () => {
    it("カテゴリ名からIDに変換する", async () => {
      const categories = [
        { id: 20, name: "フロントエンド", displayOrder: 0 },
        { id: 21, name: "バックエンド", displayOrder: 1 },
      ];
      const mockClient = {
        getCategories: vi.fn().mockResolvedValue(categories),
      };
      const service = new IssueService(mockClient as any);

      const ids = await service.resolveCategoryIds("PRJ", ["フロントエンド", "バックエンド"]);
      expect(ids).toEqual([20, 21]);
      expect(mockClient.getCategories).toHaveBeenCalledWith("PRJ");
    });
  });

  describe("resolveMilestoneIds", () => {
    it("マイルストーン名からIDに変換する", async () => {
      const versions = [
        {
          id: 30,
          projectId: 100,
          name: "v1.0",
          description: "",
          startDate: null,
          releaseDueDate: null,
          archived: false,
          displayOrder: 0,
        },
        {
          id: 31,
          projectId: 100,
          name: "v2.0",
          description: "",
          startDate: null,
          releaseDueDate: null,
          archived: false,
          displayOrder: 1,
        },
      ];
      const mockClient = {
        getVersions: vi.fn().mockResolvedValue(versions),
      };
      const service = new IssueService(mockClient as any);

      const ids = await service.resolveMilestoneIds("PRJ", ["v1.0"]);
      expect(ids).toEqual([30]);
      expect(mockClient.getVersions).toHaveBeenCalledWith("PRJ");
    });
  });

  describe("resolveAssigneeIds", () => {
    it("担当者名からIDに変換する", async () => {
      const members = [
        {
          id: 40,
          userId: "user1",
          name: "山田太郎",
          roleType: 1,
          lang: "ja",
          mailAddress: "",
          lastLoginTime: "",
        },
        {
          id: 41,
          userId: "user2",
          name: "鈴木花子",
          roleType: 2,
          lang: "ja",
          mailAddress: "",
          lastLoginTime: "",
        },
      ];
      const mockClient = {
        getProjectUsers: vi.fn().mockResolvedValue(members),
      };
      const service = new IssueService(mockClient as any);

      const ids = await service.resolveAssigneeIds("PRJ", ["山田太郎"]);
      expect(ids).toEqual([40]);
      expect(mockClient.getProjectUsers).toHaveBeenCalledWith("PRJ");
    });
  });

  describe("resolvePriorityIds", () => {
    it("優先度名からIDに変換する", async () => {
      const priorities = [
        { id: 2, name: "高" },
        { id: 3, name: "中" },
        { id: 4, name: "低" },
      ];
      const mockClient = {
        getPriorities: vi.fn().mockResolvedValue(priorities),
      };
      const service = new IssueService(mockClient as any);

      const ids = await service.resolvePriorityIds(["高", "中"]);
      expect(ids).toEqual([2, 3]);
      expect(mockClient.getPriorities).toHaveBeenCalled();
    });
  });

  describe("list with extended options", () => {
    it("issueTypeIdでフィルタできる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssues: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      await service.list({ projectKey: "PRJ", issueTypeId: [10] });
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ issueTypeId: [10] }),
      );
    });

    it("categoryIdでフィルタできる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssues: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      await service.list({ projectKey: "PRJ", categoryId: [20] });
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ categoryId: [20] }),
      );
    });

    it("milestoneIdでフィルタできる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssues: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      await service.list({ projectKey: "PRJ", milestoneId: [30] });
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ milestoneId: [30] }),
      );
    });

    it("priorityIdでフィルタできる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssues: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      await service.list({ projectKey: "PRJ", priorityId: [2] });
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ priorityId: [2] }),
      );
    });

    it("keywordで検索できる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssues: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      await service.list({ projectKey: "PRJ", keyword: "検索ワード" });
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ keyword: "検索ワード" }),
      );
    });

    it("sortとorderを指定できる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssues: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      await service.list({ projectKey: "PRJ", sort: "created", order: "asc" });
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ sort: "created", order: "asc" }),
      );
    });
  });
});
