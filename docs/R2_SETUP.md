# Cloudflare R2 設定ガイド

## 概要
このアプリケーションは、承認された画像を Cloudflare R2 に自動的にアップロードします。

## R2 の設定手順

### 1. Cloudflare アカウントでバケットを作成

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. 左メニューから **R2** を選択
3. **Create bucket** をクリック
4. バケット名を入力（例: `cloudication-images`）
5. リージョンを選択（自動推奨でOK）
6. **Create bucket** をクリック

### 2. API トークンを作成

1. R2 ダッシュボードで **Manage R2 API Tokens** をクリック
2. **Create API token** をクリック
3. トークン名を入力（例: `cloudication-upload`）
4. **Permissions** で以下を選択:
   - **Object Read & Write** を選択
5. **Create API Token** をクリック
6. 表示される以下の情報を保存:
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint URL** (例: `https://abc123.r2.cloudflarestorage.com`)

### 3. 公開アクセスの設定（オプション）

#### オプション A: カスタムドメインを使用

1. バケットの設定ページで **Settings** タブを開く
2. **Custom Domains** セクションで **Connect Domain** をクリック
3. 所有しているドメインを入力（例: `images.yourdomain.com`）
4. DNS レコードを追加（Cloudflare が自動で設定）

#### オプション B: R2.dev サブドメインを使用

1. バケットの設定ページで **Settings** タブを開く
2. **Public access** セクションで **Allow Access** をクリック
3. 確認して有効化
4. 公開 URL が表示されます（例: `https://your-bucket.r2.dev`）

### 4. 環境変数の設定

`.env` ファイルに以下を追加:

```bash
# Cloudflare R2
R2_ENDPOINT="https://abc123.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="your-access-key-id"
R2_SECRET_ACCESS_KEY="your-secret-access-key"
R2_BUCKET_NAME="cloudication-images"
R2_PUBLIC_URL="https://images.yourdomain.com"  # またはhttps://your-bucket.r2.dev
```

### 5. 動作確認

1. バックエンドを再起動:
   ```bash
   docker compose restart backend
   ```

2. 画像をアップロードしてテスト:
   ```bash
   curl -X POST http://localhost:8000/api/images/analyze \
     -F "image=@test-cloud.jpg"
   ```

3. レスポンスで `preview_url` が R2 の URL になっていることを確認

## トラブルシューティング

### アップロードエラーが発生する場合

1. **環境変数を確認**:
   ```bash
   docker compose exec backend printenv | grep R2
   ```

2. **エンドポイント URL を確認**:
   - `https://` で始まっている
   - アカウント ID が正しい

3. **API トークンの権限を確認**:
   - Object Read & Write が有効
   - 対象バケットへのアクセスが許可されている

### 画像が表示されない場合

1. **公開アクセスを確認**:
   - カスタムドメインまたは R2.dev が有効
   - CORS 設定が必要な場合は追加

2. **CORS 設定** (必要な場合):
   バケット設定 → **CORS policy** で以下を追加:
   ```json
   [
     {
       "AllowedOrigins": ["*"],
       "AllowedMethods": ["GET"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```

## セキュリティのベストプラクティス

1. **API トークンの管理**:
   - `.env` ファイルを `.gitignore` に追加
   - 本番環境では環境変数やシークレット管理サービスを使用

2. **バケットポリシー**:
   - 書き込みは API トークンのみ
   - 読み取りは公開（または認証付き）

3. **画像の検証**:
   - アップロード前に Azure Vision API で検証済み
   - 不適切なコンテンツは自動的に拒否

## コスト

Cloudflare R2 の料金:
- **ストレージ**: $0.015/GB/月（最初の10GBは無料）
- **Class A 操作** (書き込み): $4.50/百万リクエスト
- **Class B 操作** (読み取り): $0.36/百万リクエスト
- **エグレス**: 無料 🎉

詳細: https://developers.cloudflare.com/r2/pricing/
