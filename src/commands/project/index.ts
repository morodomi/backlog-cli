import { Command } from "commander";
import type { ProjectService } from "../../services/project.service.js";
import { registerProjectListCommand } from "./list.js";
import { registerProjectStatusesCommand } from "./statuses.js";
import { registerProjectTypesCommand } from "./types.js";
import { registerProjectCategoriesCommand } from "./categories.js";
import { registerProjectMilestonesCommand } from "./milestones.js";
import { registerProjectMembersCommand } from "./members.js";

export function createProjectCommand(projectService: ProjectService): Command {
  const project = new Command("project").description("プロジェクトの管理");
  registerProjectListCommand(project, projectService);
  registerProjectStatusesCommand(project, projectService);
  registerProjectTypesCommand(project, projectService);
  registerProjectCategoriesCommand(project, projectService);
  registerProjectMilestonesCommand(project, projectService);
  registerProjectMembersCommand(project, projectService);
  return project;
}
