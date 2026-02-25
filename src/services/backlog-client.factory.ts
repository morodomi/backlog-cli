import { Backlog } from "backlog-js";
import type { ConfigService } from "./config.service.js";
import { AuthNotConfiguredError } from "../errors/index.js";

export class BacklogClientFactory {
  constructor(private readonly configService: ConfigService) {}

  create(): Backlog {
    const config = this.configService.load();
    if (!config) {
      throw new AuthNotConfiguredError();
    }
    return new Backlog({ host: config.host, apiKey: config.apiKey });
  }
}
