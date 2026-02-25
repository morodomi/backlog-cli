import type { Command } from "commander";
import type { ConfigService } from "../../services/config.service.js";

export function registerLoginCommand(
  program: Command,
  configService: ConfigService,
): void {
  program
    .command("login")
    .description("Backlog APIの認証情報を設定する")
    .requiredOption("--host <host>", "Backlogホスト名 (例: xxx.backlog.jp)")
    .requiredOption("--api-key <apiKey>", "BacklogのAPIキー")
    .action((options: { host: string; apiKey: string }) => {
      configService.save({ host: options.host, apiKey: options.apiKey });
      console.log(`認証情報を保存しました (host: ${options.host})`);
    });
}
