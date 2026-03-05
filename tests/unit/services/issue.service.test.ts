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

  describe("create", () => {
    it("課題を作成する", async () => {
      const createdIssue = createIssueFixture({ issueKey: "PRJ-10", summary: "新しい課題" });
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssueTypes: vi.fn().mockResolvedValue([{ id: 10, name: "タスク" }]),
        getPriorities: vi.fn().mockResolvedValue([{ id: 3, name: "中" }]),
        postIssue: vi.fn().mockResolvedValue(createdIssue),
      };
      const service = new IssueService(mockClient as any);

      const result = await service.create({
        projectKey: "PRJ",
        summary: "新しい課題",
        issueTypeName: "タスク",
        priorityName: "中",
      });

      expect(result).toEqual(createdIssue);
      expect(mockClient.postIssue).toHaveBeenCalledWith({
        projectId: 100,
        summary: "新しい課題",
        issueTypeId: 10,
        priorityId: 3,
      });
    });

    it("オプションフィールドを指定して課題を作成する", async () => {
      const createdIssue = createIssueFixture({ issueKey: "PRJ-11" });
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssueTypes: vi.fn().mockResolvedValue([{ id: 10, name: "タスク" }]),
        getPriorities: vi.fn().mockResolvedValue([{ id: 3, name: "中" }]),
        getProjectUsers: vi.fn().mockResolvedValue([{ id: 40, name: "山田太郎" }]),
        getCategories: vi.fn().mockResolvedValue([{ id: 20, name: "フロントエンド" }]),
        getVersions: vi.fn().mockResolvedValue([{ id: 30, name: "v1.0" }]),
        postIssue: vi.fn().mockResolvedValue(createdIssue),
      };
      const service = new IssueService(mockClient as any);

      await service.create({
        projectKey: "PRJ",
        summary: "詳細な課題",
        issueTypeName: "タスク",
        priorityName: "中",
        description: "説明文",
        assigneeName: "山田太郎",
        categoryNames: ["フロントエンド"],
        milestoneNames: ["v1.0"],
      });

      expect(mockClient.postIssue).toHaveBeenCalledWith({
        projectId: 100,
        summary: "詳細な課題",
        issueTypeId: 10,
        priorityId: 3,
        description: "説明文",
        assigneeId: 40,
        categoryId: [20],
        milestoneId: [30],
      });
    });

    it("種別名が見つからない場合エラーを投げる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssueTypes: vi.fn().mockResolvedValue([{ id: 10, name: "タスク" }]),
        getPriorities: vi.fn().mockResolvedValue([{ id: 3, name: "中" }]),
      };
      const service = new IssueService(mockClient as any);

      await expect(
        service.create({
          projectKey: "PRJ",
          summary: "テスト",
          issueTypeName: "存在しない種別",
          priorityName: "中",
        }),
      ).rejects.toThrow("種別");
    });

    it("親課題キーを指定して課題を作成する", async () => {
      const parentIssue = createIssueFixture({ issueKey: "PRJ-5", summary: "親課題" });
      const createdIssue = createIssueFixture({ issueKey: "PRJ-11", summary: "子課題" });
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssueTypes: vi.fn().mockResolvedValue([{ id: 10, name: "タスク" }]),
        getPriorities: vi.fn().mockResolvedValue([{ id: 3, name: "中" }]),
        getIssue: vi.fn().mockResolvedValue(parentIssue),
        postIssue: vi.fn().mockResolvedValue(createdIssue),
      };
      const service = new IssueService(mockClient as any);

      const result = await service.create({
        projectKey: "PRJ",
        summary: "子課題",
        issueTypeName: "タスク",
        priorityName: "中",
        parentIssueKey: "PRJ-5",
      });

      expect(result).toEqual(createdIssue);
      expect(mockClient.getIssue).toHaveBeenCalledWith("PRJ-5");
      expect(mockClient.postIssue).toHaveBeenCalledWith({
        projectId: 100,
        summary: "子課題",
        issueTypeId: 10,
        priorityId: 3,
        parentIssueId: parentIssue.id,
      });
    });

    it("優先度名が見つからない場合エラーを投げる", async () => {
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssueTypes: vi.fn().mockResolvedValue([{ id: 10, name: "タスク" }]),
        getPriorities: vi.fn().mockResolvedValue([{ id: 3, name: "中" }]),
      };
      const service = new IssueService(mockClient as any);

      await expect(
        service.create({
          projectKey: "PRJ",
          summary: "テスト",
          issueTypeName: "タスク",
          priorityName: "存在しない優先度",
        }),
      ).rejects.toThrow("優先度");
    });
  });

  describe("update", () => {
    it("課題を更新する", async () => {
      const updatedIssue = createIssueFixture({ issueKey: "PRJ-1", summary: "更新済み" });
      const mockClient = {
        getProjectStatuses: vi.fn().mockResolvedValue([
          { id: 1, projectId: 100, name: "未対応", color: "#ea2c00", displayOrder: 0 },
          { id: 2, projectId: 100, name: "処理中", color: "#e87758", displayOrder: 1 },
        ]),
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        patchIssue: vi.fn().mockResolvedValue(updatedIssue),
      };
      const service = new IssueService(mockClient as any);

      const result = await service.update("PRJ-1", { statusName: "処理中" });

      expect(result).toEqual(updatedIssue);
      expect(mockClient.patchIssue).toHaveBeenCalledWith("PRJ-1", { statusId: 2 });
    });

    it("複数フィールドを同時に更新する", async () => {
      const updatedIssue = createIssueFixture({ issueKey: "PRJ-1" });
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getProjectStatuses: vi
          .fn()
          .mockResolvedValue([
            { id: 2, projectId: 100, name: "処理中", color: "#e87758", displayOrder: 1 },
          ]),
        getProjectUsers: vi.fn().mockResolvedValue([{ id: 40, name: "山田太郎" }]),
        getPriorities: vi.fn().mockResolvedValue([{ id: 2, name: "高" }]),
        getIssueTypes: vi.fn().mockResolvedValue([{ id: 11, name: "バグ" }]),
        getCategories: vi.fn().mockResolvedValue([{ id: 20, name: "フロントエンド" }]),
        getVersions: vi.fn().mockResolvedValue([{ id: 30, name: "v1.0" }]),
        patchIssue: vi.fn().mockResolvedValue(updatedIssue),
      };
      const service = new IssueService(mockClient as any);

      await service.update("PRJ-1", {
        statusName: "処理中",
        assigneeName: "山田太郎",
        priorityName: "高",
        issueTypeName: "バグ",
        categoryNames: ["フロントエンド"],
        milestoneNames: ["v1.0"],
        comment: "更新コメント",
      });

      expect(mockClient.patchIssue).toHaveBeenCalledWith("PRJ-1", {
        statusId: 2,
        assigneeId: 40,
        priorityId: 2,
        issueTypeId: 11,
        categoryId: [20],
        milestoneId: [30],
        comment: "更新コメント",
      });
    });

    it("オプションが空の場合は空パラメータで更新する", async () => {
      const updatedIssue = createIssueFixture({ issueKey: "PRJ-1" });
      const mockClient = {
        patchIssue: vi.fn().mockResolvedValue(updatedIssue),
      };
      const service = new IssueService(mockClient as any);

      const result = await service.update("PRJ-1", {});

      expect(result).toEqual(updatedIssue);
      expect(mockClient.patchIssue).toHaveBeenCalledWith("PRJ-1", {});
    });

    it("issueKeyからprojectKeyを正しく抽出する", async () => {
      const updatedIssue = createIssueFixture({ issueKey: "MY_PROJECT-123" });
      const mockClient = {
        getProjectStatuses: vi
          .fn()
          .mockResolvedValue([
            { id: 1, projectId: 100, name: "未対応", color: "#ea2c00", displayOrder: 0 },
          ]),
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "MY_PROJECT" }]),
        patchIssue: vi.fn().mockResolvedValue(updatedIssue),
      };
      const service = new IssueService(mockClient as any);

      await service.update("MY_PROJECT-123", { statusName: "未対応" });

      expect(mockClient.getProjectStatuses).toHaveBeenCalledWith(100);
    });
  });

  describe("create - 日付オプション", () => {
    it("startDate を指定して課題を作成する → postIssue に startDate が渡される", async () => {
      // Given: startDate を持つ作成オプション
      const createdIssue = createIssueFixture({ issueKey: "PRJ-20" });
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssueTypes: vi.fn().mockResolvedValue([{ id: 10, name: "タスク" }]),
        getPriorities: vi.fn().mockResolvedValue([{ id: 3, name: "中" }]),
        postIssue: vi.fn().mockResolvedValue(createdIssue),
      };
      const service = new IssueService(mockClient as any);

      // When: startDate を指定して create を呼ぶ
      await service.create({
        projectKey: "PRJ",
        summary: "日付付き課題",
        issueTypeName: "タスク",
        priorityName: "中",
        startDate: "2026-03-01",
      } as any);

      // Then: postIssue に startDate が渡される
      expect(mockClient.postIssue).toHaveBeenCalledWith(
        expect.objectContaining({ startDate: "2026-03-01" }),
      );
    });

    it("dueDate を指定して課題を作成する → postIssue に dueDate が渡される", async () => {
      // Given: dueDate を持つ作成オプション
      const createdIssue = createIssueFixture({ issueKey: "PRJ-21" });
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssueTypes: vi.fn().mockResolvedValue([{ id: 10, name: "タスク" }]),
        getPriorities: vi.fn().mockResolvedValue([{ id: 3, name: "中" }]),
        postIssue: vi.fn().mockResolvedValue(createdIssue),
      };
      const service = new IssueService(mockClient as any);

      // When: dueDate を指定して create を呼ぶ
      await service.create({
        projectKey: "PRJ",
        summary: "期限付き課題",
        issueTypeName: "タスク",
        priorityName: "中",
        dueDate: "2026-03-31",
      } as any);

      // Then: postIssue に dueDate が渡される
      expect(mockClient.postIssue).toHaveBeenCalledWith(
        expect.objectContaining({ dueDate: "2026-03-31" }),
      );
    });

    it("startDate + dueDate 両方指定 → 両方渡される", async () => {
      // Given: startDate と dueDate を両方持つ作成オプション
      const createdIssue = createIssueFixture({ issueKey: "PRJ-22" });
      const mockClient = {
        getProjects: vi.fn().mockResolvedValue([{ id: 100, projectKey: "PRJ" }]),
        getIssueTypes: vi.fn().mockResolvedValue([{ id: 10, name: "タスク" }]),
        getPriorities: vi.fn().mockResolvedValue([{ id: 3, name: "中" }]),
        postIssue: vi.fn().mockResolvedValue(createdIssue),
      };
      const service = new IssueService(mockClient as any);

      // When: startDate + dueDate 両方を指定して create を呼ぶ
      await service.create({
        projectKey: "PRJ",
        summary: "期間付き課題",
        issueTypeName: "タスク",
        priorityName: "中",
        startDate: "2026-03-01",
        dueDate: "2026-03-31",
      } as any);

      // Then: postIssue に startDate と dueDate の両方が渡される
      expect(mockClient.postIssue).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: "2026-03-01",
          dueDate: "2026-03-31",
        }),
      );
    });
  });

  describe("update - 日付オプション", () => {
    it("startDate を指定して課題を更新する → patchIssue に startDate が渡される", async () => {
      // Given: startDate を持つ更新オプション
      const updatedIssue = createIssueFixture({ issueKey: "PRJ-1" });
      const mockClient = {
        patchIssue: vi.fn().mockResolvedValue(updatedIssue),
      };
      const service = new IssueService(mockClient as any);

      // When: startDate を指定して update を呼ぶ
      await service.update("PRJ-1", { startDate: "2026-03-01" } as any);

      // Then: patchIssue に startDate が渡される
      expect(mockClient.patchIssue).toHaveBeenCalledWith(
        "PRJ-1",
        expect.objectContaining({ startDate: "2026-03-01" }),
      );
    });

    it("dueDate を指定して課題を更新する → patchIssue に dueDate が渡される", async () => {
      // Given: dueDate を持つ更新オプション
      const updatedIssue = createIssueFixture({ issueKey: "PRJ-1" });
      const mockClient = {
        patchIssue: vi.fn().mockResolvedValue(updatedIssue),
      };
      const service = new IssueService(mockClient as any);

      // When: dueDate を指定して update を呼ぶ
      await service.update("PRJ-1", { dueDate: "2026-03-31" } as any);

      // Then: patchIssue に dueDate が渡される
      expect(mockClient.patchIssue).toHaveBeenCalledWith(
        "PRJ-1",
        expect.objectContaining({ dueDate: "2026-03-31" }),
      );
    });
  });

  describe("comment", () => {
    it("課題にコメントを追加する", async () => {
      const createdComment = {
        id: 1,
        content: "テストコメント",
        changeLog: [],
        createdUser: { id: 1, name: "テストユーザー" },
        created: "2024-01-01T00:00:00Z",
        updated: "2024-01-01T00:00:00Z",
        stars: [],
        notifications: [],
      };
      const mockClient = {
        postIssueComments: vi.fn().mockResolvedValue(createdComment),
      };
      const service = new IssueService(mockClient as any);

      const result = await service.comment("PRJ-1", "テストコメント");

      expect(result).toEqual(createdComment);
      expect(mockClient.postIssueComments).toHaveBeenCalledWith("PRJ-1", {
        content: "テストコメント",
      });
    });
  });

  describe("update - 親課題操作", () => {
    it("T1: parentIssueKey を指定して更新 → getIssue で ID 解決、patchIssue に parentIssueId が渡される", async () => {
      // Given: 親課題 PRJ-5 が存在し、ID=5 を持つ
      const parentIssue = createIssueFixture({ issueKey: "PRJ-5", id: 5 });
      const updatedIssue = createIssueFixture({ issueKey: "PRJ-1", summary: "更新済み" });
      const mockClient = {
        getIssue: vi.fn().mockResolvedValue(parentIssue),
        patchIssue: vi.fn().mockResolvedValue(updatedIssue),
      };
      const service = new IssueService(mockClient as any);

      // When: parentIssueKey を指定して update を呼ぶ
      const result = await service.update("PRJ-1", { parentIssueKey: "PRJ-5" } as any);

      // Then: getIssue で PRJ-5 の ID を解決し、patchIssue に parentIssueId が渡される
      expect(result).toEqual(updatedIssue);
      expect(mockClient.getIssue).toHaveBeenCalledWith("PRJ-5");
      expect(mockClient.patchIssue).toHaveBeenCalledWith(
        "PRJ-1",
        expect.objectContaining({ parentIssueId: 5 }),
      );
    });

    it('T2: parentIssueKey に "none" を指定 → patchIssue に parentIssueId: null が渡される', async () => {
      // Given: parentIssueKey に "none" を渡す更新オプション
      const updatedIssue = createIssueFixture({ issueKey: "PRJ-1", summary: "親課題解除済み" });
      const mockClient = {
        patchIssue: vi.fn().mockResolvedValue(updatedIssue),
      };
      const service = new IssueService(mockClient as any);

      // When: parentIssueKey: "none" を指定して update を呼ぶ
      const result = await service.update("PRJ-1", { parentIssueKey: "none" } as any);

      // Then: patchIssue に parentIssueId: null が渡される（親課題解除）
      expect(result).toEqual(updatedIssue);
      expect(mockClient.patchIssue).toHaveBeenCalledWith(
        "PRJ-1",
        expect.objectContaining({ parentIssueId: null }),
      );
    });
  });

  describe("getChildIssues", () => {
    it("T3: 課題キーから子課題一覧を取得する", async () => {
      // Given: PRJ-1 が ID=1 を持ち、子課題が2件存在する
      const parentIssue = createIssueFixture({ issueKey: "PRJ-1", id: 1 });
      const childIssues = [
        createIssueFixture({ issueKey: "PRJ-2", summary: "子課題1" }),
        createIssueFixture({ issueKey: "PRJ-3", summary: "子課題2" }),
      ];
      const mockClient = {
        getIssue: vi.fn().mockResolvedValue(parentIssue),
        getIssues: vi.fn().mockResolvedValue(childIssues),
      };
      const service = new IssueService(mockClient as any);

      // When: getChildIssues で PRJ-1 の子課題を取得する
      const result = await (service as any).getChildIssues("PRJ-1");

      // Then: getIssue で PRJ-1 の ID を解決し、getIssues に parentIssueId が渡されて子課題が返る
      expect(result).toEqual(childIssues);
      expect(mockClient.getIssue).toHaveBeenCalledWith("PRJ-1");
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ parentIssueId: [1] }),
      );
    });

    it("T4: 子課題がない場合は空配列を返す", async () => {
      // Given: PRJ-1 が存在するが子課題がない
      const parentIssue = createIssueFixture({ issueKey: "PRJ-1", id: 1 });
      const mockClient = {
        getIssue: vi.fn().mockResolvedValue(parentIssue),
        getIssues: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      // When: getChildIssues を呼ぶ
      const result = await (service as any).getChildIssues("PRJ-1");

      // Then: 空配列が返る
      expect(result).toEqual([]);
      expect(mockClient.getIssues).toHaveBeenCalledWith(
        expect.objectContaining({ parentIssueId: [1] }),
      );
    });
  });

  describe("listComments", () => {
    it("コメント一覧を取得する（デフォルトオプション）", async () => {
      // Given: mock が Comment 配列を返す
      const comments = [
        {
          id: 1,
          content: "コメント1",
          changeLog: [],
          createdUser: { id: 1, name: "ユーザー1" },
          created: "2024-01-01T00:00:00Z",
          updated: "2024-01-01T00:00:00Z",
          stars: [],
          notifications: [],
        },
      ];
      const mockClient = {
        getIssueComments: vi.fn().mockResolvedValue(comments),
      };
      const service = new IssueService(mockClient as any);

      // When: listComments をデフォルトで呼ぶ
      const result = await service.listComments("PRJ-1");

      // Then: getIssueComments が count:10, order:"desc" で呼ばれる
      expect(result).toEqual(comments);
      expect(mockClient.getIssueComments).toHaveBeenCalledWith("PRJ-1", {
        count: 10,
        order: "desc",
      });
    });

    it("count を指定してコメント一覧を取得する", async () => {
      // Given: mock が空配列を返す
      const mockClient = {
        getIssueComments: vi.fn().mockResolvedValue([]),
      };
      const service = new IssueService(mockClient as any);

      // When: count:5 を指定して listComments を呼ぶ
      await service.listComments("PRJ-1", { count: 5 });

      // Then: getIssueComments が count:5 で呼ばれる
      expect(mockClient.getIssueComments).toHaveBeenCalledWith("PRJ-1", {
        count: 5,
        order: "desc",
      });
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
