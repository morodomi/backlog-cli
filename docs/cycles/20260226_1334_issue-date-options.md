---
feature: issue-date-options
cycle: cycle-13
phase: DONE
created: 2026-02-26 13:34
updated: 2026-02-26 13:34
risk: 15 (PASS)
---

# Cycle 13: Issue Date Options (start-date / due-date)

## Scope Definition

### In Scope

- [ ] `issue create` に `--start-date` / `--due-date` オプション追加
- [ ] `issue update` に `--start-date` / `--due-date` オプション追加
- [ ] 日付バリデーション (YYYY-MM-DD 形式)
- [ ] IssueService の create/update に日付パラメータ追加
- [ ] IssueCreateOptions / IssueUpdateOptions 型に日付フィールド追加
- [ ] ユニットテスト

### Out of Scope

- 親子関係操作 (次サイクル)
- CLAUDE.md / help 整備 (サイクル3)

## Environment

| Item         | Version |
| ------------ | ------- |
| Node.js      | 22.17.0 |
| TypeScript   | 5.9.3   |
| Commander.js | 14.0.3  |
| backlog-js   | 0.16.0  |
| Vitest       | 4.0.18  |

## Design

### 背景

- backlog-js の `PostIssueParams` / `PatchIssueParams` は `startDate?: string` / `dueDate?: string` をサポート済み
- 既存の create/update パターン（コマンドオプション → Options型 → Service → API params）に沿って追加

### 設計方針

1. **型定義**: `IssueCreateOptions` / `IssueUpdateOptions` に `startDate?: string` / `dueDate?: string` を追加
2. **Service層**: `create()` / `update()` で日付パラメータを backlog-js の params に渡す
3. **コマンド層**: `--start-date` / `--due-date` オプションを Commander に登録
4. **バリデーション**: YYYY-MM-DD 形式のバリデーションをコマンド層で実施

### 変更ファイル

| ファイル                                    | 変更内容                                     |
| ------------------------------------------- | -------------------------------------------- |
| `src/services/issue.service.ts`             | Options型に日付追加、create/updateで日付渡し |
| `src/commands/issue/create.ts`              | `--start-date` / `--due-date` オプション追加 |
| `src/commands/issue/update.ts`              | `--start-date` / `--due-date` オプション追加 |
| `tests/unit/services/issue.service.test.ts` | Service層テスト追加                          |
| `tests/unit/commands/issue/create.test.ts`  | コマンド層テスト追加                         |
| `tests/unit/commands/issue/update.test.ts`  | コマンド層テスト追加                         |

## Test List

### IssueService.create - 日付オプション

- [ ] T1: startDate を指定して課題を作成する → postIssue に startDate が渡される
- [ ] T2: dueDate を指定して課題を作成する → postIssue に dueDate が渡される
- [ ] T3: startDate + dueDate 両方指定 → 両方渡される

### IssueService.update - 日付オプション

- [ ] T4: startDate を指定して課題を更新する → patchIssue に startDate が渡される
- [ ] T5: dueDate を指定して課題を更新する → patchIssue に dueDate が渡される

### issue create コマンド - 日付オプション

- [ ] T6: `--start-date 2026-03-01` でサービスに startDate が渡される
- [ ] T7: `--due-date 2026-03-31` でサービスに dueDate が渡される
- [ ] T8: 不正な日付形式 `--start-date abc` でエラーメッセージ表示

### issue update コマンド - 日付オプション

- [ ] T9: `--start-date 2026-03-01` でサービスに startDate が渡される
- [ ] T10: `--due-date 2026-03-31` でサービスに dueDate が渡される
- [ ] T11: 不正な日付形式 `--due-date 2026/03/31` でエラーメッセージ表示

## Progress Log

| Phase    | Status | Notes                                            |
| -------- | ------ | ------------------------------------------------ |
| INIT     | DONE   | Cycle doc 作成                                   |
| PLAN     | DONE   | 設計・Test List作成 (11テスト)                   |
| RED      | DONE   | 11テスト作成、全て失敗確認 (142既存テストは通過) |
| GREEN    | DONE   | 全153テスト通過                                  |
| REFACTOR | DONE   | バリデーション配置統一、153テスト通過             |
| REVIEW   | DONE   | PASS (35/100), 日付バリデーション強化済み         |
| COMMIT   | DONE   | feature ブランチでコミット・push                  |
