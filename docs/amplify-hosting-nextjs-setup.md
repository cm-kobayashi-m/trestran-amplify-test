# Amplify Hosting で Next.js (SSR) をデプロイする手順

## 前提条件

- AWS CLI が設定済み
- GitHub リポジトリが作成済み
- Next.js プロジェクト（App Router）

---

## 重要なポイント

### プラットフォームの違い

| プラットフォーム | 用途 | 変更可否 |
|-----------------|------|----------|
| **WEB** | 静的サイト (SSG) | 作成後変更不可 |
| **WEB_COMPUTE** | SSR対応 (Next.js等) | 作成後変更不可 |

> ⚠️ **注意**: 一度 WEB で作成すると WEB_COMPUTE に変更できません。再作成が必要です。

### フレームワーク検出の仕組み

Amplify は指定されたルートディレクトリの `package.json` を見てフレームワークを判定します。

| 状況 | フレームワーク検出 | プラットフォーム |
|------|------------------|-----------------|
| ルートに Next.js | 自動検出 | **WEB_COMPUTE** |
| ルートに Next.js なし | 検出できない | **WEB** (静的) |
| モノレポ + ルートディレクトリ指定 | 検出される | **WEB_COMPUTE** |

---

## ディレクトリ構成（モノレポの場合）

amplify.yml はリポジトリルートでもアプリディレクトリ内でもどちらでも動作します。

```
my-project/
├── amplify.yml             # ← どちらでもOK
├── api/                    # バックエンド等
├── web/                    # Next.js アプリ
│   ├── amplify.yml         # ← どちらでもOK
│   ├── app/
│   ├── next.config.mjs
│   ├── package.json
│   └── pnpm-lock.yaml
├── .gitignore
└── README.md
```

---

## 手順

### 1. Next.js の設定

`next.config.mjs` に `output: 'standalone'` を追加：

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 他の設定...
}

export default nextConfig
```

### 2. amplify.yml の作成

**モノレポの場合は `applications` キーと `appRoot` が必須**。

> ⚠️ **重要**: `appRoot` は amplify.yml の配置場所に関係なく、**常にリポジトリルートからの絶対パス**で指定する必要があります。

```yaml
version: 1
applications:
  - appRoot: web              # リポジトリルートからのパス（必須）
    frontend:
      phases:
        preBuild:
          commands:
            - corepack enable
            - corepack prepare pnpm@latest --activate
            - pnpm install
        build:
          commands:
            - pnpm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
```

#### npm を使用する場合

```yaml
version: 1
applications:
  - appRoot: web
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
```

### 3. .gitignore の設定

プロジェクトルートに `.gitignore` を作成：

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Next.js
.next/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/

# OS
.DS_Store

# Amplify
amplify/#currentcloudbackend
amplify/.config/local-*
amplify/logs
aws-exports.js
amplifyconfiguration.json
```

### 4. GitHub にプッシュ

```bash
git init
git branch -m main
git remote add origin https://github.com/<user>/<repo>.git
git add -A
git commit -m "Initial commit"
git push -u origin main
```

### 5. Amplify アプリの作成

#### Amplify コンソールから（推奨）

1. https://console.aws.amazon.com/amplify/ にアクセス
2. 「新しいアプリを作成」→「Web アプリをホスト」
3. **GitHub** を選択して認証
4. リポジトリとブランチを選択
5. **モノレポを有効化**してルートディレクトリを指定（例: `web`）
6. フレームワークが **Next.js** と検出されていることを確認
7. 「保存してデプロイ」

#### AWS CLI から

```bash
# WEB_COMPUTE を明示的に指定してアプリ作成
aws amplify create-app \
  --name my-app \
  --platform WEB_COMPUTE \
  --profile <your-profile>

# その後、コンソールで GitHub リポジトリを接続
```

---

## モノレポ設定の注意点

### 必須設定（両方必要）

| 設定場所 | 設定内容 |
|----------|----------|
| **Amplifyコンソール** | モノレポ有効 + ルートディレクトリ指定 |
| **amplify.yml** | `applications` キー + `appRoot` 指定 |

### appRoot の指定ルール

| amplify.yml の場所 | appRoot の値 |
|-------------------|--------------|
| リポジトリルート | `web`（リポジトリルートからのパス） |
| `web/` ディレクトリ内 | `web`（リポジトリルートからのパス） |

> ⚠️ `appRoot: ./` や相対パスは**使用不可**。常にリポジトリルートからの絶対パスを指定。

### エラー例

#### `applications` キーがない

```
CustomerError: Monorepo spec provided without "applications" key
```

**原因**: コンソールでモノレポを有効にしたが、amplify.yml に `applications` キーがない

**解決**: amplify.yml に `applications` と `appRoot` を追加

#### `appRoot` がない・無効

```
CustomerError: Invalid Monorepo spec provided. The "appRoot" key needs to be a string
```

**原因**: `applications` キーはあるが `appRoot` がない、または無効な値

**解決**: `appRoot` にリポジトリルートからのパスを指定（例: `appRoot: web`）

---

## トラブルシューティング

### 404 エラーが表示される

**原因**: プラットフォームが WEB（静的）になっている

**解決方法**:
1. アプリを削除: `aws amplify delete-app --app-id <APP_ID> --profile <profile>`
2. WEB_COMPUTE で再作成
3. モノレポの場合はルートディレクトリを正しく指定

### pnpm install が失敗する

**エラー**: `ERR_PNPM_OUTDATED_LOCKFILE`

**解決方法**: `--frozen-lockfile` を使わず `pnpm install` のみにする

```yaml
preBuild:
  commands:
    - corepack enable
    - corepack prepare pnpm@latest --activate
    - pnpm install  # --frozen-lockfile を削除
```

### フレームワークが検出されない

**原因**: ルートディレクトリの指定が正しくない

**解決方法**:
- コンソールでモノレポルートディレクトリに Next.js の `package.json` があるディレクトリを指定

---

## まとめ

### モノレポで Next.js SSR をデプロイするチェックリスト

- [ ] `next.config.mjs` に `output: 'standalone'` を追加
- [ ] `amplify.yml` に `applications` キーと `appRoot` を設定
- [ ] `appRoot` はリポジトリルートからの絶対パス
- [ ] Amplify コンソールでモノレポを有効化
- [ ] コンソールでルートディレクトリを指定
- [ ] フレームワークが「Next.js」として検出されていることを確認

---

## 参考リンク

- [AWS Amplify Hosting ドキュメント](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Next.js on Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html)
- [Amplify モノレポ設定](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html#monorepo-configuration)
