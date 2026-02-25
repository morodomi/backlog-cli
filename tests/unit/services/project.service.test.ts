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
});
