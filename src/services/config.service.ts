import * as fs from "node:fs";
import * as path from "node:path";
import type { BacklogConfig } from "../types/config.js";

export class ConfigService {
  private readonly configPath: string;

  constructor(configDir?: string) {
    const dir =
      configDir ??
      path.join(
        process.env["XDG_CONFIG_HOME"] ?? path.join(process.env["HOME"]!, ".config"),
        "backlog-cli",
      );
    this.configPath = path.join(dir, "config.json");
  }

  exists(): boolean {
    return fs.existsSync(this.configPath);
  }

  save(config: BacklogConfig): void {
    const dir = path.dirname(this.configPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), "utf-8");
  }

  load(): BacklogConfig | null {
    if (!this.exists()) {
      return null;
    }
    const raw = fs.readFileSync(this.configPath, "utf-8");
    return JSON.parse(raw) as BacklogConfig;
  }

  delete(): void {
    if (this.exists()) {
      fs.unlinkSync(this.configPath);
    }
  }
}
