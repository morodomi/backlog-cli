# Backlog CLI - プロジェクト状況

## 概要

| 項目             | 値              |
| ---------------- | --------------- |
| バージョン       | 0.1.0           |
| テスト数         | 172             |
| テストファイル数 | 25              |
| カバレッジ       | -               |
| 完了サイクル     | 15 (Cycle 0-15) |

## 技術スタック

| 項目                   | 選定               |
| ---------------------- | ------------------ |
| 言語                   | TypeScript (ESM)   |
| CLIフレームワーク      | Commander.js v14   |
| APIクライアント        | backlog-js v0.16.0 |
| パッケージマネージャー | pnpm               |
| テスト                 | Vitest             |
| フォーマッタ           | Prettier           |
| 静的解析               | ESLint v9 + tsc    |
| 実行                   | tsx                |

## 現在の状態

全サイクル完了。CLI基本機能 (auth / project / issue) に加え、課題の作成・更新・コメント追加/一覧取得、開始日・期限日の設定、親課題の変更/解除、子課題一覧表示が動作可能。

## Open Issues

| # | タイトル | ラベル |
|---|---------|--------|
| 7 | fix: comment list --limit バリデーション追加 | bug |
| 8 | fix: formatCommentTable 複数行コメント・日付フォーマット対応 | bug |
| 9 | refactor: コマンドハンドラのエラーハンドリング共通化 | enhancement |
| 10 | refactor: createCommentFixture をテストヘルパーに追加 | enhancement |
