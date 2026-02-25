import type { Backlog, Entity } from "backlog-js";

export interface ProjectListOptions {
  archived?: boolean;
}

export class ProjectService {
  constructor(private readonly client: Backlog) {}

  async list(options: ProjectListOptions = {}): Promise<Entity.Project.Project[]> {
    const params: Record<string, unknown> = {};
    if (options.archived !== undefined) {
      params["archived"] = options.archived;
    }
    return this.client.getProjects(params);
  }

  async getStatuses(projectKey: string): Promise<Entity.Project.ProjectStatus[]> {
    return this.client.getProjectStatuses(projectKey);
  }

  async getIssueTypes(projectKey: string): Promise<Entity.Issue.IssueType[]> {
    return this.client.getIssueTypes(projectKey);
  }

  async getCategories(projectKey: string): Promise<Entity.Project.Category[]> {
    return this.client.getCategories(projectKey);
  }

  async getVersions(projectKey: string): Promise<Entity.Project.Version[]> {
    return this.client.getVersions(projectKey);
  }

  async getMembers(projectKey: string): Promise<Entity.User.User[]> {
    return this.client.getProjectUsers(projectKey);
  }
}
