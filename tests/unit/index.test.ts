import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { createProgram } from "../../src/index.js";

describe("createProgram", () => {
  let originalHome: string | undefined;
  let tmpDir: string;

  beforeEach(() => {
    originalHome = process.env["XDG_CONFIG_HOME"];
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "backlog-cli-test-"));
    process.env["XDG_CONFIG_HOME"] = tmpDir;
  });

  afterEach(() => {
    if (originalHome !== undefined) {
      process.env["XDG_CONFIG_HOME"] = originalHome;
    } else {
      delete process.env["XDG_CONFIG_HOME"];
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("Commandインスタンスを返す", () => {
    const program = createProgram();
    expect(program.name()).toBe("backlog");
  });

  it("auth, project, issue サブコマンドが登録されている", () => {
    const program = createProgram();
    const commandNames = program.commands.map((c) => c.name());
    expect(commandNames).toContain("auth");
    expect(commandNames).toContain("project");
    expect(commandNames).toContain("issue");
  });

  it("認証未設定でもプログラムが作成できる", () => {
    expect(() => createProgram()).not.toThrow();
  });
});
