import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { BacklogClientFactory } from "../../../src/services/backlog-client.factory.js";
import { ConfigService } from "../../../src/services/config.service.js";
import { AuthNotConfiguredError } from "../../../src/errors/index.js";

describe("BacklogClientFactory", () => {
  let tmpDir: string;
  let configService: ConfigService;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "backlog-cli-test-"));
    configService = new ConfigService(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("create", () => {
    it("認証設定が存在する場合、Backlogクライアントを生成する", () => {
      configService.save({ host: "test.backlog.jp", apiKey: "test-key" });
      const factory = new BacklogClientFactory(configService);

      const client = factory.create();
      expect(client).toBeDefined();
    });

    it("認証設定が存在しない場合、AuthNotConfiguredError をスローする", () => {
      const factory = new BacklogClientFactory(configService);

      expect(() => factory.create()).toThrow(AuthNotConfiguredError);
      expect(() => factory.create()).toThrow(
        "認証が設定されていません。`backlog auth login` を実行してください。",
      );
    });
  });
});
