---
feature: project-service
cycle: cycle-4
phase: DONE
created: 2026-02-25 14:20
updated: 2026-02-25 14:21
---

# Cycle 4: Project Service & Command

## Scope Definition

### In Scope
- [x] ProjectService クラス (list with archived filter)
- [x] `backlog project list` コマンド
- [x] --archived / --json オプション
- [x] formatProjectTable (テーブル表示)
- [x] ユニットテスト

### Out of Scope
- プロジェクト作成/更新/削除
- プロジェクト詳細表示

### Files to Change
- `src/services/project.service.ts` (new)
- `src/commands/project/list.ts` (new)
- `src/commands/project/index.ts` (new)
- `src/formatters/table.formatter.ts` (new)
- `tests/unit/services/project.service.test.ts` (new)
- `tests/unit/commands/project/list.test.ts` (new)
- `tests/unit/formatters/table.formatter.test.ts` (new)
- `tests/helpers/fixtures.ts` (new)

## Environment

### Scope
- Layer: Both
- Plugin: ts
- Risk: 10 (PASS)

### Dependencies
- backlog-js: Entity.Project.Project 型

## Test List

### DONE
- [x] TC-01: プロジェクト一覧を取得できる
- [x] TC-02: archived フィルタが動作する
- [x] TC-03: 空一覧時に「見つかりません」メッセージ
- [x] TC-04: list コマンドがテーブル出力する
- [x] TC-05: --json オプションでJSON出力
- [x] TC-06: --archived オプションが伝搬する
- [x] TC-07: formatProjectTable が正しい形式
- [x] TC-08: 空配列で「見つかりません」

## Implementation Notes

### Goal
Backlog のプロジェクト一覧を取得してテーブル形式で表示する。

### Design Approach
- ProjectService: backlog-js の getProjects() をラップ
- formatProjectTable: Key / Name / Archived カラム
- padEnd ヘルパーで固定幅表示

## Progress Log

### 2026-02-25 14:20 - RED
- 8テスト作成

### 2026-02-25 14:21 - DONE
- 実装・テスト・レビュー完了
