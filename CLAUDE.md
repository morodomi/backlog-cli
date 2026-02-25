# Backlog CLI

backlog.jp (Nulab提供) の閲覧・操作をCLI経由で行うツール。

日本語で返答する。質問があれば、解決するまで繰り返し質問する。

## 技術スタック

| 項目                   | 選定               |
| ---------------------- | ------------------ |
| 言語                   | TypeScript (ESM)   |
| CLIフレームワーク      | Commander.js v14   |
| APIクライアント        | backlog-js v0.16.0 |
| パッケージマネージャー | pnpm               |
| テスト                 | Vitest             |
| フォーマッタ           | Prettier           |
| 静的解析               | tsc --noEmit       |
| 実行                   | tsx                |

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
# 認証
backlog auth login --host xxx.backlog.jp --api-key KEY
backlog auth status

# プロジェクト
backlog project list [--archived] [--json]
backlog project statuses <projectKey> [--json]
backlog project types <projectKey> [--json]
backlog project categories <projectKey> [--json]
backlog project milestones <projectKey> [--json]
backlog project members <projectKey> [--json]

# 課題
backlog issue list -p PROJECT_KEY [--status ...] [--type ...] [--category ...]
                                  [--milestone ...] [--assignee ...]
                                  [--priority ...] [--keyword <text>]
                                  [--sort <key>] [--order asc|desc]
                                  [--limit N] [--json]
backlog issue view ISSUE_KEY [--json]
backlog issue create -p PROJECT_KEY --summary "件名" --type タスク --priority 中
                     [--description "説明"] [--assignee 名前]
                     [--category ...] [--milestone ...] [--json]
backlog issue update ISSUE_KEY [--status ステータス名] [--assignee 名前]
                               [--priority 優先度名] [--type 種別名]
                               [--category ...] [--milestone ...]
                               [--comment "更新コメント"] [--json]
backlog issue comment ISSUE_KEY --content "コメント本文" [--json]
```

## Quality Standards

| 項目         | 基準                   |
| ------------ | ---------------------- |
| カバレッジ   | 90%+ (最低80%)         |
| 型チェック   | tsc --noEmit エラー0件 |
| フォーマット | Prettier準拠           |
