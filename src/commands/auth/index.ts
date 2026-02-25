import { Command } from "commander";
import type { ConfigService } from "../../services/config.service.js";
import { registerLoginCommand } from "./login.js";
import { registerStatusCommand } from "./status.js";

export function createAuthCommand(configService: ConfigService): Command {
  const auth = new Command("auth").description("認証情報の管理");
  registerLoginCommand(auth, configService);
  registerStatusCommand(auth, configService);
  return auth;
}
