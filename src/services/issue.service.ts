import type { Backlog, Entity } from "backlog-js";

export interface IssueListOptions {
  projectKey: string;
  statusId?: number[];
  assigneeId?: number[];
  limit?: number;
}

export class IssueService {
  constructor(private readonly client: Backlog) {}

  async list(options: IssueListOptions): Promise<Entity.Issue.Issue[]> {
    const projectId = await this.resolveProjectId(options.projectKey);
    const params: Record<string, unknown> = {
      projectId: [projectId],
    };
    if (options.statusId) {
      params["statusId"] = options.statusId;
    }
    if (options.assigneeId) {
      params["assigneeId"] = options.assigneeId;
    }
    if (options.limit) {
      params["count"] = options.limit;
    }
    return this.client.getIssues(params);
  }

  async view(issueKey: string): Promise<Entity.Issue.Issue> {
    return this.client.getIssue(issueKey);
  }

  async getStatuses(projectKey: string): Promise<Entity.Project.ProjectStatus[]> {
    const projectId = await this.resolveProjectId(projectKey);
    return this.client.getProjectStatuses(projectId);
  }

  async resolveStatusIds(projectKey: string, statusNames: string[]): Promise<number[]> {
    const statuses = await this.getStatuses(projectKey);
    return statusNames
      .map((name) => statuses.find((s) => s.name === name))
      .filter((s): s is Entity.Project.ProjectStatus => s !== undefined)
      .map((s) => s.id);
  }

  private async resolveProjectId(projectKey: string): Promise<number> {
    const projects = await this.client.getProjects({});
    const project = projects.find((p: Entity.Project.Project) => p.projectKey === projectKey);
    if (!project) {
      throw new Error(`プロジェクト "${projectKey}" が見つかりません`);
    }
    return project.id;
  }
}
