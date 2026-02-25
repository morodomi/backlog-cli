import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { Command } from "commander";
import { ConfigService } from "../../../../src/services/config.service.js";
import { registerLoginCommand } from "../../../../src/commands/auth/login.js";

describe("auth login command", () => {
  let tmpDir: string;
  let configService: ConfigService;
  let program: Command;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "backlog-cli-test-"));
    configService = new ConfigService(tmpDir);
    program = new Command();
    program.exitOverride();
    registerLoginCommand(program, configService);
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it("--host と --api-key で認証情報を保存する", async () => {
    await program.parseAsync([
      "node",
      "test",
      "login",
      "--host",
      "test.backlog.jp",
      "--api-key",
      "my-api-key",
    ]);

    const config = configService.load();
    expect(config).toEqual({ host: "test.backlog.jp", apiKey: "my-api-key" });
  });

  it("保存後に成功メッセージを出力する", async () => {
    await program.parseAsync([
      "node",
      "test",
      "login",
      "--host",
      "test.backlog.jp",
      "--api-key",
      "my-api-key",
    ]);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("認証情報を保存しました"),
    );
  });

  it("--host が未指定の場合エラーになる", async () => {
    await expect(
      program.parseAsync(["node", "test", "login", "--api-key", "key"]),
    ).rejects.toThrow();
  });

  it("--api-key が未指定の場合エラーになる", async () => {
    await expect(
      program.parseAsync(["node", "test", "login", "--host", "test.backlog.jp"]),
    ).rejects.toThrow();
  });
});
