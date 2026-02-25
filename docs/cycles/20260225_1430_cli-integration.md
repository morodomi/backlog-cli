---
feature: cli-integration
cycle: cycle-7
phase: DONE
created: 2026-02-25 14:30
updated: 2026-02-25 14:35
---

# Cycle 7: CLI Integration

## Scope Definition

### In Scope
- [x] createProgram() でサブコマンド統合
- [x] 認証未設定時のスタブコマンド (project/issue)
- [x] bin/backlog.ts エントリポイント
- [x] ユニットテスト

### Out of Scope
- npm publish
- グローバルインストール

### Files to Change
- `src/index.ts` (edit - 統合)
- `bin/backlog.ts` (edit)
- `tests/unit/index.test.ts` (new)

## Environment

### Scope
- Layer: Frontend (CLI)
- Plugin: ts
- Risk: 10 (PASS)

## Test List

### DONE
- [x] TC-01: createProgram() が program を返す
- [x] TC-02: auth サブコマンドが登録されている
- [x] TC-03: 認証未設定時もCLIが起動する (スタブコマンド)

## Implementation Notes

### Goal
全サブコマンド (auth, project, issue) を統合し、CLIとして動作させる。

### Design Approach
- createProgram(): ConfigService → BacklogClientFactory → 各Service → 各Command を組み立て
- 認証未設定時は AuthNotConfiguredError をキャッチしてスタブコマンドを登録
- スタブコマンドは「認証が設定されていません」メッセージを表示

## Progress Log

### 2026-02-25 14:30 - RED
- 3テスト作成

### 2026-02-25 14:33 - GREEN
- createProgram 実装

### 2026-02-25 14:35 - DONE
- 全45テスト成功、カバレッジ87%
