# Backlog CLI

backlog.jp (Nulab提供) をコマンドラインから操作するCLIツール。

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
  --description "説明" --assignee 山田太郎 --category フロントエンド --milestone v1.0

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
