# Backlog CLI

backlog.jp (Nulab提供) の閲覧・操作をCLI経由で行うツール。

日本語で返答する。質問があれば、解決するまで繰り返し質問する。

## 技術スタック

| 項目 | 選定 |
|------|------|
| 言語 | TypeScript (ESM) |
| CLIフレームワーク | Commander.js v14 |
| APIクライアント | backlog-js v0.16.0 |
| パッケージマネージャー | pnpm |
| テスト | Vitest |
| フォーマッタ | Prettier |
| 静的解析 | tsc --noEmit |
| 実行 | tsx |

## Quick Commands

```bash
pnpm dev [args]          # CLI実行 (tsx経由)
pnpm test                # テスト実行
pnpm test:watch          # テスト監視モード
pnpm test:coverage       # カバレッジ計測
npx tsc --noEmit         # 型チェック
npx prettier --check .   # フォーマットチェック
npx prettier --write .   # フォーマット適用
```

## TDD Workflow

```
INIT → PLAN → RED → GREEN → REFACTOR → REVIEW → COMMIT
```

各フェーズは対応する dev-crew スキルで実行。Cycle doc は `docs/cycles/` に記録。

## アーキテクチャ

```
CLI (Commander) → Service層 → backlog-js (API Client)
                            → ConfigService (認証情報)
```

```
bin/backlog.ts            # エントリポイント
src/
  index.ts                # Commander program定義
  commands/{auth,project,issue}/  # CLIコマンド
  services/               # ビジネスロジック
  formatters/             # 出力フォーマット
  errors/                 # カスタムエラー
  types/                  # 型定義
tests/unit/               # ユニットテスト
docs/cycles/              # Cycle docs
```

## CLIコマンド

```bash
backlog auth login --host xxx.backlog.jp --api-key KEY
backlog auth status
backlog project list [--archived] [--json]
backlog issue list -p PROJECT_KEY [--status ...] [--limit N] [--json]
backlog issue view ISSUE_KEY [--json]
```

## Quality Standards

| 項目 | 基準 |
|------|------|
| カバレッジ | 90%+ (最低80%) |
| 型チェック | tsc --noEmit エラー0件 |
| フォーマット | Prettier準拠 |
