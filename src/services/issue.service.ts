import type { Backlog, Entity, Option } from "backlog-js";

export interface IssueCreateOptions {
  projectKey: string;
  summary: string;
  issueTypeName: string;
  priorityName: string;
  description?: string;
  assigneeName?: string;
  categoryNames?: string[];
  milestoneNames?: string[];
  parentIssueKey?: string;
  startDate?: string;
  dueDate?: string;
}

export interface IssueUpdateOptions {
  statusName?: string;
  assigneeName?: string;
  priorityName?: string;
  issueTypeName?: string;
  categoryNames?: string[];
  milestoneNames?: string[];
  comment?: string;
  startDate?: string;
  dueDate?: string;
}

export interface IssueListOptions {
  projectKey: string;
  statusId?: number[];
  issueTypeId?: number[];
  categoryId?: number[];
  milestoneId?: number[];
  assigneeId?: number[];
  priorityId?: number[];
  keyword?: string;
  sort?: string;
  order?: "asc" | "desc";
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
    if (options.issueTypeId) {
      params["issueTypeId"] = options.issueTypeId;
    }
    if (options.categoryId) {
      params["categoryId"] = options.categoryId;
    }
    if (options.milestoneId) {
      params["milestoneId"] = options.milestoneId;
    }
    if (options.assigneeId) {
      params["assigneeId"] = options.assigneeId;
    }
    if (options.priorityId) {
      params["priorityId"] = options.priorityId;
    }
    if (options.keyword) {
      params["keyword"] = options.keyword;
    }
    if (options.sort) {
      params["sort"] = options.sort;
    }
    if (options.order) {
      params["order"] = options.order;
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

  async resolveIssueTypeIds(projectKey: string, names: string[]): Promise<number[]> {
    const issueTypes = await this.client.getIssueTypes(projectKey);
    return names
      .map((name) => issueTypes.find((t: Entity.Issue.IssueType) => t.name === name))
      .filter((t): t is Entity.Issue.IssueType => t !== undefined)
      .map((t) => t.id);
  }

  async resolveCategoryIds(projectKey: string, names: string[]): Promise<number[]> {
    const categories = await this.client.getCategories(projectKey);
    return names
      .map((name) => categories.find((c: Entity.Project.Category) => c.name === name))
      .filter((c): c is Entity.Project.Category => c !== undefined)
      .map((c) => c.id);
  }

  async resolveMilestoneIds(projectKey: string, names: string[]): Promise<number[]> {
    const versions = await this.client.getVersions(projectKey);
    return names
      .map((name) => versions.find((v: Entity.Project.Version) => v.name === name))
      .filter((v): v is Entity.Project.Version => v !== undefined)
      .map((v) => v.id);
  }

  async resolveAssigneeIds(projectKey: string, names: string[]): Promise<number[]> {
    const members = await this.client.getProjectUsers(projectKey);
    return names
      .map((name) => members.find((m: Entity.User.User) => m.name === name))
      .filter((m): m is Entity.User.User => m !== undefined)
      .map((m) => m.id);
  }

  async resolvePriorityIds(names: string[]): Promise<number[]> {
    const priorities = await this.client.getPriorities();
    return names
      .map((name) => priorities.find((p: Entity.Issue.Priority) => p.name === name))
      .filter((p): p is Entity.Issue.Priority => p !== undefined)
      .map((p) => p.id);
  }

  async create(options: IssueCreateOptions): Promise<Entity.Issue.Issue> {
    const projectId = await this.resolveProjectId(options.projectKey);

    const issueTypeIds = await this.resolveIssueTypeIds(options.projectKey, [
      options.issueTypeName,
    ]);
    if (issueTypeIds.length === 0) {
      throw new Error(`種別 "${options.issueTypeName}" が見つかりません`);
    }

    const priorityIds = await this.resolvePriorityIds([options.priorityName]);
    if (priorityIds.length === 0) {
      throw new Error(`優先度 "${options.priorityName}" が見つかりません`);
    }

    const params: Option.Issue.PostIssueParams = {
      projectId,
      summary: options.summary,
      issueTypeId: issueTypeIds[0],
      priorityId: priorityIds[0],
    };

    if (options.description) {
      params.description = options.description;
    }
    if (options.assigneeName) {
      const assigneeIds = await this.resolveAssigneeIds(options.projectKey, [options.assigneeName]);
      if (assigneeIds.length > 0) {
        params.assigneeId = assigneeIds[0];
      }
    }
    if (options.parentIssueKey) {
      const parentIssue = await this.client.getIssue(options.parentIssueKey);
      params.parentIssueId = parentIssue.id;
    }
    if (options.categoryNames) {
      params.categoryId = await this.resolveCategoryIds(options.projectKey, options.categoryNames);
    }
    if (options.milestoneNames) {
      params.milestoneId = await this.resolveMilestoneIds(
        options.projectKey,
        options.milestoneNames,
      );
    }
    if (options.startDate) {
      params.startDate = options.startDate;
    }
    if (options.dueDate) {
      params.dueDate = options.dueDate;
    }

    return this.client.postIssue(params);
  }

  async update(issueKey: string, options: IssueUpdateOptions): Promise<Entity.Issue.Issue> {
    const projectKey = issueKey.replace(/-\d+$/, "");
    const params: Option.Issue.PatchIssueParams = {};

    if (options.statusName) {
      const statusIds = await this.resolveStatusIds(projectKey, [options.statusName]);
      if (statusIds.length > 0) {
        params.statusId = statusIds[0];
      }
    }
    if (options.assigneeName) {
      const assigneeIds = await this.resolveAssigneeIds(projectKey, [options.assigneeName]);
      if (assigneeIds.length > 0) {
        params.assigneeId = assigneeIds[0];
      }
    }
    if (options.priorityName) {
      const priorityIds = await this.resolvePriorityIds([options.priorityName]);
      if (priorityIds.length > 0) {
        params.priorityId = priorityIds[0];
      }
    }
    if (options.issueTypeName) {
      const issueTypeIds = await this.resolveIssueTypeIds(projectKey, [options.issueTypeName]);
      if (issueTypeIds.length > 0) {
        params.issueTypeId = issueTypeIds[0];
      }
    }
    if (options.categoryNames) {
      params.categoryId = await this.resolveCategoryIds(projectKey, options.categoryNames);
    }
    if (options.milestoneNames) {
      params.milestoneId = await this.resolveMilestoneIds(projectKey, options.milestoneNames);
    }
    if (options.comment) {
      params.comment = options.comment;
    }
    if (options.startDate) {
      params.startDate = options.startDate;
    }
    if (options.dueDate) {
      params.dueDate = options.dueDate;
    }

    return this.client.patchIssue(issueKey, params);
  }

  async comment(issueKey: string, content: string): Promise<Entity.Issue.Comment> {
    return this.client.postIssueComments(issueKey, { content });
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
