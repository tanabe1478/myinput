# Issue: Database Schema Setup with Drizzle ORM

**ID**: `db-schema-7f2a9c`
**Created**: 2025-12-31
**Branch**: `claude/db-schema-7f2a9c`

## Goal

RSS Reader MVPのためのDrizzle ORMとデータベーススキーマを設定する。8つのテーブル定義とマイグレーションの作成まで（CRUD操作やGraphQL統合は含まない）。

## Context

プロジェクトセットアップ（PR #2）が完了し、フロントエンド（React + Vite）とバックエンド（Cloudflare Workers + Hono + GraphQL Yoga）の基盤が整った。次のステップとして、データベース層を構築する。

Cloudflare D1（SQLite）を使用し、Drizzle ORMで型安全なデータベースアクセスを実現する。

## Acceptance Criteria

- [ ] Drizzle ORMとDrizzle Kitがインストールされている
- [ ] 8つのテーブル（users, feeds, items, item_states, themes, theme_keywords, today_snapshots, today_snapshot_items）がスキーマ定義されている
- [ ] すべての外部キー、ユニーク制約、インデックスが正しく定義されている
- [ ] マイグレーションファイルが生成されている
- [ ] ローカル環境でマイグレーションが適用できる
- [ ] スキーマ検証テストが通過する
- [ ] マイグレーションテストが通過する
- [ ] GraphQL contextにDrizzle clientが統合されている
- [ ] TypeScriptの型エラーがない
- [ ] すべてのテストが通過する（10/10 from project setup + new DB tests）

## Requirements

- **認証**: Auth.js を使用（users.auth_id にAuth.jsのユーザーIDを保存）
- **スコープ**: スキーマ定義 + マイグレーションのみ
- **テスト**: TDDアプローチ必須
- **Cron Jobs**: 後のタスクで実装

## Related

- Spec: `.claude/specs/2025-12/db-schema-7f2a9c.md`
- Log: `.claude/log/2025-12/db-schema-7f2a9c.md`
- Previous: PR #2 (Project Setup)
- Reference: `.claude/specs/2025-12/rss-reader-spec-a3f7e9.md`
