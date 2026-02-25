# Backlog CLI

> **Claude Code だけで構築した CLI ツール** のサンプルプロジェクトです。
> 人間は一切コードを書いていません。Claude Code との対話のみで開発されました。

backlog.jp (Nulab提供) をコマンドラインから操作する CLI ツール。

## Claude Code サンプルプロジェクトとして

このリポジトリは、Claude Code の実践的な活用例を示すために公開しています。

- **人間はコードを一切書いていない** — すべてのコード・テスト・設定ファイルは Claude Code が生成
- **CLAUDE.md と `.claude/rules/` で振る舞いを制御** — プロジェクトレベルの指示書で Claude Code の開発方針を定義
- **TDD サイクルで開発** — `INIT → PLAN → RED → GREEN → REFACTOR → REVIEW → COMMIT` の各フェーズを経て機能を実装

### 開発の経緯

開発の過程は `docs/cycles/` に Cycle doc として残っています。各 Cycle doc には、機能ごとの設計判断・テスト一覧・実装の流れが記録されています。

一部のセッション履歴は残っていません。初期のセッションや試行錯誤の過程には、Cycle doc として記録されていないものもあります。

### CLAUDE.md について

Claude Code は `CLAUDE.md` ファイルをプロジェクトの指示書として読み込みます。このプロジェクトでは 2 層構造で運用しました:

| レベル       | ファイル                         | 内容                                                                   |
| ------------ | -------------------------------- | ---------------------------------------------------------------------- |
| プロジェクト | `CLAUDE.md` (リポジトリルート)   | 技術スタック・アーキテクチャ・品質基準など、このプロジェクト固有の指示 |
| グローバル   | `~/.claude/CLAUDE.md` (ローカル) | TDD 例外なし・知的誠実性ルールなど、全プロジェクト共通の開発哲学       |

グローバル設定はリポジトリに含まれませんが、その内容はプロジェクト `CLAUDE.md` の「開発哲学」セクションに転記してあります。

## インストール

```bash
pnpm install
```

## 使い方

### 認証設定

```bash
pnpm dev auth login --host your-space.backlog.jp --api-key YOUR_API_KEY
pnpm dev auth status
```

### プロジェクト一覧

```bash
pnpm dev project list
pnpm dev project list --archived
pnpm dev project list --json
```

### 課題操作

```bash
# 一覧・詳細
pnpm dev issue list -p PROJECT_KEY
pnpm dev issue list -p PROJECT_KEY --status 未対応 処理中
pnpm dev issue list -p PROJECT_KEY --limit 10 --json
pnpm dev issue view ISSUE-1
pnpm dev issue view ISSUE-1 --json

# 作成
pnpm dev issue create -p PROJECT_KEY --summary "件名" --type タスク --priority 中
pnpm dev issue create -p PROJECT_KEY --summary "件名" --type タスク --priority 中 \
  --description "説明" --assignee 山田太郎 --category フロントエンド --milestone v1.0 \
  --parent ISSUE-1

# 更新
pnpm dev issue update ISSUE-1 --status 処理中
pnpm dev issue update ISSUE-1 --status 処理中 --assignee 山田太郎 --comment "対応開始"

# コメント
pnpm dev issue comment ISSUE-1 --content "コメント本文"
```

## 開発

```bash
pnpm test              # テスト実行
pnpm test:watch        # テスト監視モード
pnpm test:coverage     # カバレッジ計測
npx tsc --noEmit       # 型チェック
npx prettier --check . # フォーマットチェック
```

## 技術スタック

- TypeScript (ESM)
- Commander.js v14
- backlog-js v0.16.0
- Vitest / Prettier

## ライセンス

ISC
