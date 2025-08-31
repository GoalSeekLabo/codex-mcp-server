# Codex MCP Server

<div align="center">

![Codex MCP Server](https://img.shields.io/badge/MCP-Server-blue?logo=anthropic)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**OpenAI Codex CLI と Claude Code をModel Context Protocol (MCP) で統合**

[インストール](#インストール) • [使用方法](#使用方法) • [利用可能なツール](#利用可能なツール) • [設定](#設定) • [トラブルシューティング](#トラブルシューティング)

</div>

## 概要

Codex MCP Server は OpenAI Codex CLI と Claude Code をシームレスに統合し、Model Context Protocol (MCP) を通じてClaude Code内でCodexの強力なAIコーディング機能を直接使用できるようにします。

### ✨ 機能

- 🚀 **グローバルインストール** - 一度インストールすれば、Claude Code のどこからでも使用可能
- 🛠️ **6つの強力なツール** - 実行、分析、修正、汎用操作、Web検索対応
- 🔒 **セキュア** - タイムアウト制御付きサンドボックス実行
- ⚡ **高速** - 効率的なTypeScript実装
- 🎯 **簡単セットアップ** - ワンコマンドでインストールと設定
- 📝 **TypeScript** - 完全な型安全性と優れた開発体験

### 🎯 利用可能なツール

| ツール | 説明 | 使用例 |
|------|-----|--------|
| **codex.exec** | プロンプトでCodexコマンドを実行 | コード生成、アルゴリズム説明、関数作成 |
| **codex.analyze** | コードの問題を分析 | セキュリティ監査、パフォーマンス確認、コード品質 |
| **codex.fix** | AIアシスタンスでコードの問題を修正 | バグ修正、最適化提案、リファクタリング |
| **codex.general** | 汎用Codex CLI操作 | カスタムコマンド、高度なワークフロー |
| **codex.search** | 高速Web検索（構造化結果） | API仕様確認、エラー意味調査、技術情報検索 |
| **codex.search_detailed** | 詳細Web検索（フルコンテンツ） | チュートリアル取得、実装例分析、深い技術解説 |

## 必要な環境

- **Node.js 18+** - MCPサーバーの実行に必要
- **OpenAI Codex CLI** - 基盤となるAIコーディングツール
- **Claude Code** - MCPサーバーを使用するクライアント
- **OpenAI API キー** - またはChatGPT Plus/Pro/Team/Enterprise サブスクリプション

## インストール

### 🚀 クイックインストール（推奨）

```bash
# オプション1: ワンコマンドインストール（近日公開）
npx create-codex-mcp --global

# オプション2: ソースから手動インストール
git clone https://github.com/goalseeklabs/codex-mcp-server.git
cd codex-mcp-server
./setup/install.sh
```

### 📦 手動インストール

1. **Codex CLI のインストール**（未インストールの場合）:
```bash
# npmを使用
npm install -g @openai/codex

# またはHomebrew（macOS）
brew install codex
```

2. **Codex MCP Server のインストール**:
```bash
npm install -g codex-mcp-server
```

3. **Claude Code の設定**:
```bash
codex-mcp-setup
```

4. **Claude Code を再起動**すると、ツールが使用可能になります！

## 使用方法

### 基本的な使用例

#### 1. コード生成
```
codex.exec ツールを使用してフィボナッチ数を計算するPython関数を作成してください
```

#### 2. コード分析
```
codex.analyze ツールを使用して、このJavaScriptファイルのセキュリティ脆弱性をチェックしてください: /path/to/file.js
```

#### 3. 問題修正
```
codex.fix ツールを使用して、この関数のパフォーマンス問題を修正してください: [コードを貼り付け]
```

#### 4. カスタムコマンド
```
codex.general ツールを使用してカスタムCodex操作を実行: このコードベースのアーキテクチャを説明してください
```

#### 5. Web検索（高速）
```
codex.search ツールを使用して、React useEffectフックの最新ベストプラクティスを調べてください
```

#### 6. Web検索（詳細）
```
codex.search_detailed ツールを使用して、TypeScript genericsの詳しいチュートリアルと実装例を取得してください
```

### ツールパラメータ

#### codex.exec
```json
{
  "prompt": "ユーザー認証用のREST APIエンドポイントを作成",
  "args": ["--language", "typescript"],
  "workingDirectory": "/path/to/project",
  "timeout": 30000
}
```

#### codex.analyze
```json
{
  "filePath": "/path/to/file.js",
  "analysisType": "security",
  "workingDirectory": "/path/to/project"
}
```

#### codex.fix
```json
{
  "filePath": "/path/to/buggy-file.py",
  "issueDescription": "この関数のメモリリークを修正",
  "workingDirectory": "/path/to/project",
  "dryRun": true
}
```

#### codex.general
```json
{
  "command": "explain",
  "args": ["--detailed", "architecture"],
  "workingDirectory": "/path/to/project",
  "timeout": 60000
}
```

#### codex.search
```json
{
  "query": "React hooks useEffect best practices 2024",
  "provider": "bing",
  "workingDirectory": "/path/to/project",
  "timeout": 30000
}
```

#### codex.search_detailed
```json
{
  "query": "TypeScript advanced generics tutorial examples",
  "provider": "bing",
  "maxPages": 3,
  "workingDirectory": "/path/to/project",
  "timeout": 60000
}
```

## 設定

### グローバル設定

MCPサーバーは以下のファイルを通じてClaude Codeでグローバルに設定されます：
```
~/.config/claude-code/mcp_settings.json
```

### 環境変数

```bash
# OpenAI APIキー（ChatGPTサブスクリプションを使用しない場合）
export OPENAI_API_KEY="your-api-key-here"

# オプション: カスタムタイムアウト（ミリ秒）
export CODEX_MCP_TIMEOUT="30000"
```

### 高度な設定

グローバル設定を変更してサーバーの動作をカスタマイズできます：

```json
{
  "mcpServers": {
    "codex": {
      "command": "codex-mcp",
      "args": [],
      "env": {
        "CODEX_MCP_TIMEOUT": "45000"
      }
    }
  }
}
```

## 開発

### ソースからのビルド

```bash
git clone https://github.com/goalseeklabs/codex-mcp-server.git
cd codex-mcp-server

# 依存関係のインストール
npm install

# TypeScriptのビルド
npm run build

# テストの実行
npm test

# テスト用にグローバルインストール
npm install -g .
```

### テスト

```bash
# バリデーションテストの実行
npm run test

# 手動バリデーション
node tests/validation.js

# サーバー起動テスト
node tests/startup-test.js
```

### プロジェクト構造

```
codex-mcp-server/
├── src/
│   ├── index.ts          # メインMCPサーバー
│   ├── codex.ts         # Codex CLI統合
│   └── schemas.ts       # 型定義とバリデーション
├── bin/
│   ├── codex-mcp.js     # CLIエントリーポイント
│   └── setup.js         # セットアップコマンド
├── config/
│   └── claude-code-mcp.json  # Claude Code設定テンプレート
├── setup/
│   └── install.sh       # インストールスクリプト
├── tests/
│   ├── validation.js    # バリデーションテスト
│   └── startup-test.js  # 起動テスト
└── docs/
    └── usage-guide.md   # 詳細使用ガイド
```

## トラブルシューティング

### よくある問題

#### ❌ "Codex CLI is not available"
```bash
# Codex CLIのインストール
npm install -g @openai/codex
# または
brew install codex

# インストール確認
codex --version
```

#### ❌ "Command not found: codex-mcp"
```bash
# グローバルインストール確認
npm list -g codex-mcp-server

# 必要に応じて再インストール
npm install -g codex-mcp-server

# PATH確認
echo $PATH
```

#### ❌ "MCP server not responding"
```bash
# Claude Codeの再起動
# サーバーログの確認
codex-mcp --version

# セットアップ再実行
codex-mcp-setup
```

#### ❌ "Permission denied"
```bash
# macOS/Linuxでの権限修正
sudo chown -R $(whoami) ~/.config/claude-code
chmod 755 ~/.config/claude-code
```

### デバッグモード

デバッグログの有効化：
```bash
DEBUG=codex-mcp:* codex-mcp
```

### サポート

- 🐛 **バグレポート**: [GitHub Issues](https://github.com/goalseeklabs/codex-mcp-server/issues)
- 💬 **ディスカッション**: [GitHub Discussions](https://github.com/goalseeklabs/codex-mcp-server/discussions)
- 📧 **メール**: support@goalseeklabs.com

## 貢献

貢献を歓迎します！詳細については[Contributing Guide](CONTRIBUTING.md)をご覧ください。

### 貢献者向けクイックスタート

1. リポジトリをフォーク
2. 機能ブランチ作成: `git checkout -b feature/amazing-feature`
3. 変更を加える
4. テスト実行: `npm test`
5. コミット: `git commit -m 'Add amazing feature'`
6. プッシュ: `git push origin feature/amazing-feature`
7. プルリクエストを開く

## ライセンス

このプロジェクトはApache License 2.0の下でライセンスされています - 詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## ⚠️ 免責事項・重要な注意事項

**使用前に必ず [免責事項・重要な注意事項](DISCLAIMER.md) をお読みください。**

## 更新履歴

### v0.2.0 (2025-08-30)
- 🔍 **Web検索機能追加** - Codex CLIのweb search機能を統合
- ✅ 高速検索ツール（codex.search）追加 - 構造化結果で素早い情報収集
- ✅ 詳細検索ツール（codex.search_detailed）追加 - フルページ内容で深い分析
- ✅ マルチプロバイダー対応（Bing、Google、DuckDuckGo）
- ✅ 検索プロバイダー自動選択とカスタム設定対応
- ⚡ 詳細検索デフォルトページ数最適化（3ページで最大情報取得）
- 🛠️ 6つの強力なツールでより包括的なコーディング支援

### v0.1.0 (2025-08-30)
- 🎉 初回リリース
- ✅ Claude Code とのフルMCP統合
- ✅ 4つのコアツール（exec、analyze、fix、general）
- ✅ グローバルインストール対応
- ✅ 自動セットアップと設定
- ✅ TypeScript実装
- ✅ 包括的テスト

---

<div align="center">
  <p><a href="https://goalseeklabs.com">Goal Seek Laboratory</a> が ❤️ を込めて作成</p>
  <p><a href="https://openai.com">OpenAI Codex</a> と <a href="https://claude.ai">Claude Code</a> を活用</p>
</div>