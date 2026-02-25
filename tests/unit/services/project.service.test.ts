import { describe, it, expect, vi } from "vitest";
import { ProjectService } from "../../../src/services/project.service.js";
import { createProjectFixture } from "../../helpers/fixtures.js";

describe("ProjectService", () => {
  describe("list", () => {
    it("プロジェクト一覧を取得する", async () => {
      const projects = [
        createProjectFixture({ id: 1, projectKey: "PRJ1", name: "プロジェクト1" }),
        createProjectFixture({ id: 2, projectKey: "PRJ2", name: "プロジェクト2" }),
      ];
      const mockClient = { getProjects: vi.fn().mockResolvedValue(projects) };
      const service = new ProjectService(mockClient as any);

      const result = await service.list();
      expect(result).toEqual(projects);
      expect(mockClient.getProjects).toHaveBeenCalledWith({});
    });

    it("archived オプションでアーカイブ済みを含める", async () => {
      const mockClient = { getProjects: vi.fn().mockResolvedValue([]) };
      const service = new ProjectService(mockClient as any);

      await service.list({ archived: true });
      expect(mockClient.getProjects).toHaveBeenCalledWith({ archived: true });
    });

    it("archived: false でアーカイブされていないプロジェクトのみ取得", async () => {
      const mockClient = { getProjects: vi.fn().mockResolvedValue([]) };
      const service = new ProjectService(mockClient as any);

      await service.list({ archived: false });
      expect(mockClient.getProjects).toHaveBeenCalledWith({ archived: false });
    });
  });

  describe("getStatuses", () => {
    it("プロジェクトのステータス一覧を取得する", async () => {
      const statuses = [
        { id: 1, projectId: 100, name: "未対応", color: "#ea2c00" as const, displayOrder: 0 },
        { id: 2, projectId: 100, name: "処理中", color: "#e87758" as const, displayOrder: 1 },
      ];
      const mockClient = { getProjectStatuses: vi.fn().mockResolvedValue(statuses) };
      const service = new ProjectService(mockClient as any);

      const result = await service.getStatuses("PRJ");
      expect(result).toEqual(statuses);
      expect(mockClient.getProjectStatuses).toHaveBeenCalledWith("PRJ");
    });
  });

  describe("getIssueTypes", () => {
    it("プロジェクトの種別一覧を取得する", async () => {
      const issueTypes = [
        { id: 1, projectId: 100, name: "タスク", color: "#7ea800", displayOrder: 0 },
        { id: 2, projectId: 100, name: "バグ", color: "#e07b9a", displayOrder: 1 },
      ];
      const mockClient = { getIssueTypes: vi.fn().mockResolvedValue(issueTypes) };
      const service = new ProjectService(mockClient as any);

      const result = await service.getIssueTypes("PRJ");
      expect(result).toEqual(issueTypes);
      expect(mockClient.getIssueTypes).toHaveBeenCalledWith("PRJ");
    });
  });

  describe("getCategories", () => {
    it("プロジェクトのカテゴリ一覧を取得する", async () => {
      const categories = [
        { id: 1, name: "フロントエンド", displayOrder: 0 },
        { id: 2, name: "バックエンド", displayOrder: 1 },
      ];
      const mockClient = { getCategories: vi.fn().mockResolvedValue(categories) };
      const service = new ProjectService(mockClient as any);

      const result = await service.getCategories("PRJ");
      expect(result).toEqual(categories);
      expect(mockClient.getCategories).toHaveBeenCalledWith("PRJ");
    });
  });

  describe("getVersions", () => {
    it("プロジェクトのバージョン（マイルストーン）一覧を取得する", async () => {
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
      ];
      const mockClient = { getVersions: vi.fn().mockResolvedValue(versions) };
      const service = new ProjectService(mockClient as any);

      const result = await service.getVersions("PRJ");
      expect(result).toEqual(versions);
      expect(mockClient.getVersions).toHaveBeenCalledWith("PRJ");
    });
  });

  describe("getMembers", () => {
    it("プロジェクトのメンバー一覧を取得する", async () => {
      const members = [
        {
          id: 1,
          userId: "user1",
          name: "ユーザー1",
          roleType: 1,
          lang: "ja",
          mailAddress: "u1@example.com",
          lastLoginTime: "",
        },
        {
          id: 2,
          userId: "user2",
          name: "ユーザー2",
          roleType: 2,
          lang: "ja",
          mailAddress: "u2@example.com",
          lastLoginTime: "",
        },
      ];
      const mockClient = { getProjectUsers: vi.fn().mockResolvedValue(members) };
      const service = new ProjectService(mockClient as any);

      const result = await service.getMembers("PRJ");
      expect(result).toEqual(members);
      expect(mockClient.getProjectUsers).toHaveBeenCalledWith("PRJ");
    });
  });
});
