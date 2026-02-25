import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { Command } from "commander";
import { ConfigService } from "../../../../src/services/config.service.js";
import { registerStatusCommand } from "../../../../src/commands/auth/status.js";

describe("auth status command", () => {
  let tmpDir: string;
  let configService: ConfigService;
  let program: Command;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "backlog-cli-test-"));
    configService = new ConfigService(tmpDir);
    program = new Command();
    program.exitOverride();
    registerStatusCommand(program, configService);
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it("認証設定が存在する場合、ホスト名を表示する", async () => {
    configService.save({ host: "test.backlog.jp", apiKey: "key123" });

    await program.parseAsync(["node", "test", "status"]);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("test.backlog.jp"),
    );
  });

  it("認証設定が存在する場合、APIキーをマスクして表示する", async () => {
    configService.save({ host: "test.backlog.jp", apiKey: "abcdefghijklmnop" });

    await program.parseAsync(["node", "test", "status"]);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("abcd****"));
  });

  it("認証設定が存在しない場合、未設定メッセージを表示する", async () => {
    await program.parseAsync(["node", "test", "status"]);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("認証が設定されていません"),
    );
  });
});
