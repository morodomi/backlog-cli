---
feature: issue-parent-operations
cycle: cycle-14
phase: DONE
created: 2026-02-26 13:55
updated: 2026-02-26 13:55
risk: 25 (PASS)
---

# Cycle 14: Issue Parent Operations

## Scope Definition

### In Scope

- [ ] `issue update --parent <issueKey>` で親課題を変更/設定
- [ ] `issue update --parent none` で親課題を解除
- [ ] `issue view` で子課題一覧を表示
- [ ] IssueUpdateOptions に parentIssueKey フィールド追加
- [ ] ユニットテスト

### Out of Scope

- CLAUDE.md / help 整備 (サイクル3)
- 開始日・期限日 (サイクル1で完了)

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

- backlog-js の `PatchIssueParams` は `parentIssueId?: number` をサポート
- `Entity.Issue.Issue` には `parentIssueId?: number` がある
- 子課題一覧は `getIssues` に `parentIssueId: [issueId]` を渡して取得
- 親課題解除は Backlog API に `parentIssueId: null` を送信（backlog-js の型は `number` だが実際には null 送信が必要）

### 設計方針

1. **IssueUpdateOptions**: `parentIssueKey?: string` 追加（`"none"` で解除を表現）
2. **IssueService.update()**: `parentIssueKey` が `"none"` なら `parentIssueId` を未設定/解除扱いで API に送信、それ以外は課題キーから ID を解決して設定
3. **IssueService.getChildIssues()**: 新メソッド追加。issueKey から issueId を取得し、`getIssues({ parentIssueId: [id] })` で子課題一覧を返す
4. **issue update コマンド**: `--parent <issueKey|none>` オプション追加
5. **issue view コマンド**: 子課題一覧を表示欄に追加
6. **formatIssueDetail()**: 親課題ID表示 + 子課題一覧セクション追加

### 変更ファイル

| ファイル                                         | 変更内容                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| `src/services/issue.service.ts`                  | IssueUpdateOptions 型追加、update() 親課題処理、getChildIssues() 追加 |
| `src/commands/issue/update.ts`                   | `--parent` オプション追加                                             |
| `src/commands/issue/view.ts`                     | 子課題一覧取得・表示                                                  |
| `src/formatters/detail.formatter.ts`             | 親課題・子課題の表示追加                                              |
| `tests/unit/services/issue.service.test.ts`      | Service テスト追加                                                    |
| `tests/unit/commands/issue/update.test.ts`       | コマンドテスト追加                                                    |
| `tests/unit/commands/issue/view.test.ts`         | 子課題表示テスト追加                                                  |
| `tests/unit/formatters/detail.formatter.test.ts` | フォーマッタテスト追加                                                |

## Test List

### IssueService.update - 親課題操作

- [ ] T1: parentIssueKey を指定して更新 → getIssue で ID 解決、patchIssue に parentIssueId が渡される
- [ ] T2: parentIssueKey に "none" を指定 → patchIssue に parentIssueId: null が渡される

### IssueService.getChildIssues

- [ ] T3: 課題キーから子課題一覧を取得する
- [ ] T4: 子課題がない場合は空配列を返す

### issue update コマンド - 親課題オプション

- [ ] T5: `--parent PRJ-5` でサービスに parentIssueKey が渡される
- [ ] T6: `--parent none` でサービスに parentIssueKey "none" が渡される

### issue view コマンド - 子課題表示

- [ ] T7: 子課題がある場合、表示に子課題一覧が含まれる
- [ ] T8: 子課題がない場合、子課題セクションが表示されない

### formatIssueDetail - 親課題・子課題表示

- [ ] T9: parentIssueId がある場合、Parent 行が表示される
- [ ] T10: 子課題配列が渡された場合、子課題セクションが表示される

## Progress Log

| Phase    | Status | Notes                                            |
| -------- | ------ | ------------------------------------------------ |
| INIT     | DONE   | Cycle doc 作成                                   |
| PLAN     | DONE   | 設計・Test List作成 (10テスト)                   |
| RED      | DONE   | 10テスト作成、全て失敗確認 (153既存テストは通過) |
| GREEN    | DONE   | 全163テスト通過                                  |
| REFACTOR | DONE   | Prettier適用、tsc通過、build.testはタイムアウト(既存問題) |
| REVIEW   | DONE   | WARN (68/100) security+correctness, 型安全性の指摘あり(backlog-js制約) |
| COMMIT   | DONE   |                                                  |
