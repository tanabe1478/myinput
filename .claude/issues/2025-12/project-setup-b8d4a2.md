# RSS Reader MVP - Project Setup

**ID**: `project-setup-b8d4a2`
**Created**: 2025-12-30

## Context
RSS Reader MVP の仕様書が完成し、GraphQL + TDD で実装することが確定しました。最初のステップとして、開発環境全体のセットアップを行います。

## Task Description
以下を含む、開発可能な状態のプロジェクト構造を構築：
- ディレクトリ構造の設計と作成
- フロントエンド: React + Vite + TypeScript + shadcn/ui + Tailwind CSS + GraphQL client
- バックエンド: Cloudflare Workers + Hono + graphql-yoga + Pothos
- データベース: Cloudflare D1 設定
- テストインフラ: Vitest + Playwright + MSW
- 開発環境: Wrangler CLI 設定、並行実行スクリプト
- 検証テスト: セットアップが正しく動作することを確認

## Scope
- In scope:
  - プロジェクト全体のディレクトリ構造
  - package.json と依存関係のインストール
  - TypeScript, ESLint, Prettier 設定
  - Vite 設定 (frontend)
  - Wrangler 設定 (backend + D1)
  - GraphQL クライアント/サーバー基盤
  - テストフレームワーク設定
  - 開発用スクリプト (dev, build, test)
  - 基本的な health check エンドポイント
  - セットアップ検証テスト（E2E含む）
  - README.md (セットアップ手順)
- Out of scope:
  - 実際の機能実装 (Today画面、認証など)
  - データベーススキーマ/マイグレーション（別タスク）
  - shadcn/ui コンポーネントの個別追加（必要に応じて後で）
  - デプロイ設定（別タスク）

## Related Files
- Spec: `.claude/specs/2025-12/project-setup-b8d4a2.md`
- Log: `.claude/log/2025-12/project-setup-b8d4a2.md`
- Reference Spec: `.claude/specs/2025-12/rss-reader-spec-a3f7e9.md`

## Notes
TDD必須：セットアップが完了した時点で、`npm test` が通り、基本的な GraphQL query/mutation が動作することを検証テストで保証します。
