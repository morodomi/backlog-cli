import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { rmSync } from "node:fs";

describe("ビルドパイプライン", () => {
  beforeAll(() => {
    // dist/ をクリーンアップしてからビルド
    rmSync("dist", { recursive: true, force: true });
  });

  afterAll(() => {
    // テスト後にクリーンアップ
    rmSync("dist", { recursive: true, force: true });
  });

  it("pnpm build が成功する", () => {
    expect(() => {
      execSync("pnpm build", { stdio: "pipe" });
    }).not.toThrow();
  });

  it("dist/bin/backlog.js が生成される", () => {
    execSync("pnpm build", { stdio: "pipe" });
    expect(existsSync("dist/bin/backlog.js")).toBe(true);
  });

  it("dist/src/index.js が生成される", () => {
    execSync("pnpm build", { stdio: "pipe" });
    expect(existsSync("dist/src/index.js")).toBe(true);
  });

  it("dist/bin/backlog.js に shebang が含まれる", () => {
    execSync("pnpm build", { stdio: "pipe" });
    const content = readFileSync("dist/bin/backlog.js", "utf-8");
    expect(content.startsWith("#!/usr/bin/env node")).toBe(true);
  });

  it("dist/ にテストファイルが含まれない", () => {
    execSync("pnpm build", { stdio: "pipe" });
    expect(existsSync("dist/tests")).toBe(false);
  });

  it("package.json の bin が dist/bin/backlog.js を指す", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    expect(pkg.bin.backlog).toBe("./dist/bin/backlog.js");
  });

  it("package.json の files に dist が含まれる", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    expect(pkg.files).toContain("dist");
  });

  it("package.json に build スクリプトがある", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    expect(pkg.scripts.build).toBeDefined();
  });
});
