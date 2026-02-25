---
feature: backlog-client-factory
cycle: cycle-2
phase: DONE
created: 2026-02-25 14:15
updated: 2026-02-25 14:16
---

# Cycle 2: Backlog Client Factory

## Scope Definition

### In Scope

- [x] BacklogClientFactory クラス
- [x] AuthNotConfiguredError カスタムエラー
- [x] ConfigService → Backlog インスタンス生成
- [x] ユニットテスト

### Out of Scope

- クライアントキャッシュ
- 接続テスト

### Files to Change

- `src/services/backlog-client.factory.ts` (new)
- `src/errors/index.ts` (new)
- `tests/unit/services/backlog-client.factory.test.ts` (new)

## Environment

### Scope

- Layer: Backend
- Plugin: ts
- Risk: 5 (PASS)

### Dependencies

- backlog-js: ^0.16.0

## Test List

### DONE

- [x] TC-01: 認証設定がある場合、Backlogインスタンスを返す
- [x] TC-02: 認証未設定の場合、AuthNotConfiguredErrorをスローする

## Implementation Notes

### Goal

ConfigService から認証情報を読み取り、backlog-js クライアントを生成するファクトリ。

### Design Approach

- コンストラクタインジェクションで ConfigService を受け取る
- create() で Backlog インスタンスを生成
- 設定が無い場合は専用エラーをスロー

## Progress Log

### 2026-02-25 14:15 - RED

- 2テスト作成

### 2026-02-25 14:16 - DONE

- 実装完了、全テスト成功
