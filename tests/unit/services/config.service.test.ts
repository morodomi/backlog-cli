import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { ConfigService } from "../../../src/services/config.service.js";

describe("ConfigService", () => {
  let tmpDir: string;
  let service: ConfigService;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "backlog-cli-test-"));
    service = new ConfigService(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("exists", () => {
    it("設定ファイルが存在しない場合 false を返す", () => {
      expect(service.exists()).toBe(false);
    });

    it("設定ファイルが存在する場合 true を返す", () => {
      service.save({ host: "test.backlog.jp", apiKey: "key123" });
      expect(service.exists()).toBe(true);
    });
  });

  describe("save", () => {
    it("設定を保存し、ファイルが作成される", () => {
      const config = { host: "test.backlog.jp", apiKey: "key123" };
      service.save(config);

      const filePath = path.join(tmpDir, "config.json");
      expect(fs.existsSync(filePath)).toBe(true);

      const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      expect(raw).toEqual(config);
    });

    it("ディレクトリが存在しない場合でも再帰的に作成する", () => {
      const nestedDir = path.join(tmpDir, "nested", "dir");
      const nestedService = new ConfigService(nestedDir);
      nestedService.save({ host: "test.backlog.jp", apiKey: "key" });

      expect(fs.existsSync(path.join(nestedDir, "config.json"))).toBe(true);
    });
  });

  describe("load", () => {
    it("保存した設定を読み込める", () => {
      const config = { host: "test.backlog.jp", apiKey: "key123" };
      service.save(config);

      const loaded = service.load();
      expect(loaded).toEqual(config);
    });

    it("設定ファイルが存在しない場合 null を返す", () => {
      expect(service.load()).toBeNull();
    });

    it("不正なJSONファイルの場合 null を返す", () => {
      const filePath = path.join(tmpDir, "config.json");
      fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(filePath, "{ invalid json }", "utf-8");

      expect(service.load()).toBeNull();
    });
  });

  describe("delete", () => {
    it("設定ファイルを削除する", () => {
      service.save({ host: "test.backlog.jp", apiKey: "key123" });
      expect(service.exists()).toBe(true);

      service.delete();
      expect(service.exists()).toBe(false);
    });

    it("存在しないファイルを削除しようとしてもエラーにならない", () => {
      expect(() => service.delete()).not.toThrow();
    });
  });
});
