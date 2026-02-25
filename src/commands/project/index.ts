import { Command } from "commander";
import type { ProjectService } from "../../services/project.service.js";
import { registerProjectListCommand } from "./list.js";

export function createProjectCommand(projectService: ProjectService): Command {
  const project = new Command("project").description("プロジェクトの管理");
  registerProjectListCommand(project, projectService);
  return project;
}
