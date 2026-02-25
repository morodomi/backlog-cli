---
feature: config-service
cycle: cycle-1
phase: DONE
created: 2026-02-25 14:10
updated: 2026-02-25 14:15
---

# Cycle 1: Config Service

## Scope Definition

### In Scope

- [x] BacklogConfig 型定義
- [x] ConfigService クラス (save/load/exists/delete)
- [x] XDG準拠の設定ファイルパス (~/.config/backlog-cli/config.json)
- [x] ユニットテスト

### Out of Scope

- 暗号化 (平文保存)
- マルチプロファイル

### Files to Change

- `src/types/config.ts` (new)
- `src/services/config.service.ts` (new)
- `tests/unit/services/config.service.test.ts` (new)

## Environment

### Scope

- Layer: Backend
- Plugin: ts
- Risk: 10 (PASS)

### Dependencies

- node:fs, node:path (built-in)

## Test List

### DONE

- [x] TC-01: save()で設定ファイルを作成できる
- [x] TC-02: load()で設定を読み込める
- [x] TC-03: exists()で存在チェックできる
- [x] TC-04: delete()で削除できる
- [x] TC-05: 存在しないファイルのload()はnullを返す
- [x] TC-06: ディレクトリが存在しなくても save() が成功する
- [x] TC-07: XDG_CONFIG_HOME を尊重する
- [x] TC-08: カスタムconfigDirを受け付ける

## Implementation Notes

### Goal

認証情報 (host, apiKey) を永続化するサービスを作成する。

### Design Approach

- fs.readFileSync / writeFileSync でJSON読み書き
- XDG Base Directory 仕様に準拠
- コンストラクタでconfigDir注入可能 (テスト容易性)

## Progress Log

### 2026-02-25 14:10 - RED

- 8テスト作成、全て失敗

### 2026-02-25 14:13 - GREEN

- ConfigService実装、全テスト成功

### 2026-02-25 14:15 - DONE

- リファクタ・レビュー完了
