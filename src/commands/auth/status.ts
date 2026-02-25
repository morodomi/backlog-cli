import type { Command } from "commander";
import type { ConfigService } from "../../services/config.service.js";

function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 4) {
    return "****";
  }
  return apiKey.slice(0, 4) + "****";
}

export function registerStatusCommand(
  program: Command,
  configService: ConfigService,
): void {
  program
    .command("status")
    .description("現在の認証状態を表示する")
    .action(() => {
      const config = configService.load();
      if (!config) {
        console.log("認証が設定されていません。`backlog auth login` を実行してください。");
        return;
      }
      console.log(`Host:    ${config.host}`);
      console.log(`API Key: ${maskApiKey(config.apiKey)}`);
    });
}
