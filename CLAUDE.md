# Backlog CLI

backlog.jp (Nulab提供) の閲覧・操作をCLI経由で行うツール。

日本語で返答する。質問があれば、解決するまで繰り返し質問する。

## 開発哲学

### TDD（例外なし）

すべての機能開発・バグ修正は、例外なく TDD サイクルを通す。

```
INIT → PLAN → RED → GREEN → REFACTOR → REVIEW → COMMIT
```

各フェーズは対応する tdd-skills スキルで実行。Cycle doc は `docs/cycles/` に記録。

- エラー発見 → 再現テスト作成 → 修正 → テスト成功確認（いきなり修正しない）
- 「急いでいる」と言われても TDD を維持

### AI アシスタントへの指示

**禁止事項:**

- テストなしの実装
- 不確実な情報での推測（確認を求めること）
- 不要なファイル作成

**必須事項:**

- エラー報告 → TDD サイクルで対応
- 機能追加 → TDD サイクルで対応

### 知的誠実性

- 相手の主張に同意する前に、まずその主張の最も弱い点を特定する
- 「妥当」「同意」は結論であり、出発点ではない
- 迎合は同意ではない。早すぎる収束は思考の放棄である

### テスト設計

**Given/When/Then 形式** を推奨。

### ルールファイル

Git・セキュリティに関するルールは `.claude/rules/` に配置:

- [`.claude/rules/git-safety.md`](.claude/rules/git-safety.md) — `--no-verify` 禁止、ブランチ保護など
- [`.claude/rules/git-conventions.md`](.claude/rules/git-conventions.md) — コミットメッセージ形式 (`feat|fix|docs|refactor|test|chore`)
- [`.claude/rules/security.md`](.claude/rules/security.md) — 秘密鍵管理、コミット前チェック

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
                             # 親課題ID・子課題一覧も表示
backlog issue create -p PROJECT_KEY --summary "件名" --type タスク --priority 中
                     [--description "説明"] [--assignee 名前]
                     [--category ...] [--milestone ...]
                     [--parent 課題キー]
                     [--start-date YYYY-MM-DD] [--due-date YYYY-MM-DD]
                     [--json]
backlog issue update ISSUE_KEY [--status ステータス名] [--assignee 名前]
                               [--priority 優先度名] [--type 種別名]
                               [--category ...] [--milestone ...]
                               [--start-date YYYY-MM-DD] [--due-date YYYY-MM-DD]
                               [--parent 課題キー|none]
                               [--comment "更新コメント"] [--json]
backlog issue comment add ISSUE_KEY --content "コメント本文" [--json]
backlog issue comment list ISSUE_KEY [--limit N] [--json]
```

## Quality Standards

| 項目         | 基準                   |
| ------------ | ---------------------- |
| カバレッジ   | 90%+ (最低80%)         |
| 型チェック   | tsc --noEmit エラー0件 |
| フォーマット | Prettier準拠           |
