---
feature: issue-write-commands
cycle: cycle-9-to-12
phase: DONE
created: 2026-02-25 21:50
updated: 2026-02-25 21:56
---

# Cycle 9-12: Issue Write Commands (create / update / comment)

## Scope Definition

### In Scope

- [x] IssueService.create() / update() / comment() メソッド
- [x] IssueCreateOptions / IssueUpdateOptions インターフェース
- [x] `backlog issue create` コマンド
- [x] `backlog issue update` コマンド
- [x] `backlog issue comment` コマンド
- [x] formatIssueCreated / formatIssueUpdated / formatCommentCreated フォーマッタ
- [x] --json オプション対応
- [x] ユニットテスト
- [x] CLAUDE.md CLI コマンドセクション更新

### Out of Scope

- 課題削除 (ステータス変更で代替)
- ファイル添付

### Files Changed

- `src/services/issue.service.ts` (edit - create/update/comment追加, Option型import)
- `src/commands/issue/create.ts` (new)
- `src/commands/issue/update.ts` (new)
- `src/commands/issue/comment.ts` (new)
- `src/commands/issue/index.ts` (edit - サブコマンド登録)
- `src/formatters/detail.formatter.ts` (edit - 3フォーマッタ追加)
- `tests/unit/services/issue.service.test.ts` (edit - 9テスト追加)
- `tests/unit/commands/issue/create.test.ts` (new - 5テスト)
- `tests/unit/commands/issue/update.test.ts` (new - 4テスト)
- `tests/unit/commands/issue/comment.test.ts` (new - 4テスト)
- `tests/unit/commands/issue/index.test.ts` (edit - サブコマンド確認更新)
- `tests/unit/formatters/detail.formatter.test.ts` (edit - 3テスト追加)

## Environment

### Scope

- Layer: Both (Service + Command + Formatter)
- Plugin: ts
- Risk: 5 (PASS)

### Dependencies

- backlog-js: postIssue / patchIssue / postIssueComments API
- Option.Issue.PostIssueParams / PatchIssueParams 型

## Test List

### DONE

- [x] TC-01: 必須パラメータで課題を作成できる
- [x] TC-02: オプションフィールド付きで課題を作成できる
- [x] TC-03: 種別名が見つからない場合エラー
- [x] TC-04: 優先度名が見つからない場合エラー
- [x] TC-05: 課題のステータスを更新できる
- [x] TC-06: 複数フィールドを同時に更新できる
- [x] TC-07: 空オプションで更新できる
- [x] TC-08: issueKeyからprojectKeyを正しく抽出する
- [x] TC-09: 課題にコメントを追加できる
- [x] TC-10: create コマンドが必須オプションで動作する
- [x] TC-11: create コマンドがオプションフィールドを受け付ける
- [x] TC-12: create コマンドの --json 出力
- [x] TC-13: create コマンドの必須オプション未指定エラー
- [x] TC-14: create コマンドのAPI失敗エラーハンドリング
- [x] TC-15: update コマンドがステータス更新できる
- [x] TC-16: update コマンドが複数フィールド更新できる
- [x] TC-17: update コマンドの --json 出力
- [x] TC-18: update コマンドのAPI失敗エラーハンドリング
- [x] TC-19: comment コマンドがコメント追加できる
- [x] TC-20: comment コマンドの --json 出力
- [x] TC-21: comment コマンドの --content 未指定エラー
- [x] TC-22: comment コマンドのAPI失敗エラーハンドリング
- [x] TC-23: formatIssueCreated が作成結果を表示する
- [x] TC-24: formatIssueUpdated が更新結果を表示する
- [x] TC-25: formatCommentCreated がコメント追加結果を表示する

## Implementation Notes

### Design Decisions

- **名前解決**: 既存の resolveXxxIds メソッドを再利用。create の issueType/priority は必須なので結果が空ならエラー、update は任意なので無視
- **projectKey 抽出**: `issueKey.replace(/-\d+$/, "")` でupdate/comment時に使用
- **型安全性**: `Record<string, unknown>` ではなく `Option.Issue.PostIssueParams` / `PatchIssueParams` を使用
- **フォーマッタ**: 書き込み結果に特化した簡潔な1行出力

## Progress Log

### 2026-02-25 21:49 - RED (Cycle 9: Service)

- IssueService の create/update/comment テスト9件作成、全て失敗確認

### 2026-02-25 21:50 - GREEN (Cycle 9: Service)

- create/update/comment メソッド実装、テスト全パス

### 2026-02-25 21:51 - RED (Cycle 10-11: Commands + Formatter)

- コマンドテスト13件 + フォーマッタテスト3件作成、全て失敗確認

### 2026-02-25 21:52 - GREEN (Cycle 10-11: Commands + Formatter)

- 3コマンドファイル + 3フォーマッタ関数実装、index.ts更新

### 2026-02-25 21:55 - REFACTOR (Cycle 12: Quality)

- tsc型エラー修正 (Record<string, unknown> → Option.Issue.PostIssueParams)
- Prettier適用
- 全140テストパス、カバレッジ98.96%

### 2026-02-25 21:56 - DONE

- 全品質チェッククリア (tsc / ESLint / Prettier)
