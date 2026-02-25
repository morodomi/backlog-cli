import { Command } from "commander";
import { ConfigService } from "./services/config.service.js";
import { BacklogClientFactory } from "./services/backlog-client.factory.js";
import { ProjectService } from "./services/project.service.js";
import { IssueService } from "./services/issue.service.js";
import { createAuthCommand } from "./commands/auth/index.js";
import { createProjectCommand } from "./commands/project/index.js";
import { createIssueCommand } from "./commands/issue/index.js";
import { AuthNotConfiguredError } from "./errors/index.js";

export function createProgram(): Command {
  const program = new Command();

  program
    .name("backlog")
    .description("Backlog CLI - backlog.jp をコマンドラインから操作する")
    .version("0.1.0");

  const configService = new ConfigService();
  const clientFactory = new BacklogClientFactory(configService);

  // auth コマンド (認証不要)
  program.addCommand(createAuthCommand(configService));

  // 認証が必要なコマンドは遅延でクライアントを生成
  try {
    const client = clientFactory.create();
    program.addCommand(createProjectCommand(new ProjectService(client)));
    program.addCommand(createIssueCommand(new IssueService(client)));
  } catch (e) {
    if (e instanceof AuthNotConfiguredError) {
      // 認証未設定でもCLIは起動可能 (auth loginを使えるように)
      // project/issue コマンドはヘルプのみ表示するスタブを登録
      const projectStub = new Command("project").description("プロジェクトの管理");
      projectStub.action(() => {
        console.error("認証が設定されていません。`backlog auth login` を実行してください。");
        process.exitCode = 1;
      });
      const issueStub = new Command("issue").description("課題の管理");
      issueStub.action(() => {
        console.error("認証が設定されていません。`backlog auth login` を実行してください。");
        process.exitCode = 1;
      });
      program.addCommand(projectStub);
      program.addCommand(issueStub);
    } else {
      throw e;
    }
  }

  return program;
}
