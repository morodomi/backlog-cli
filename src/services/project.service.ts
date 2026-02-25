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
}
