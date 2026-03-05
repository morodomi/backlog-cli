export class AuthNotConfiguredError extends Error {
  constructor() {
    super("認証が設定されていません。`backlog auth login` を実行してください。");
    this.name = "AuthNotConfiguredError";
  }
}

export function handleCommandError(e: unknown): void {
  console.error(e instanceof Error ? e.message : String(e));
  process.exitCode = 1;
}
