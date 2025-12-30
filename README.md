# クモ二ケーション / cloudication
匿名雲投稿アプリ / Clouds, Shared Anonymously

## 環境構築手順

### リポジトリのクローン
``` bash
git clone https://github.com/tacoskiy/cloudication.git
```
``` bash
cd cloudication
```
### 環境変数の設定
`.env`をルートディレクトリに作成し、環境変数を設定

基本的には`.env.example`の内容をコピーすれば動作可能
``` env
# database
POSTGRES_USER="user"
POSTGRES_PASSWORD="password"
POSTGRES_DB="appdb"

DATABASE_URL="postgresql://user:password@db:5432/appdb"

# backend
BACKEND_PORT="8000"

# frontend
FRONTEND_PORT="3000"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```
### コンテナの立ち上げ
1. `make up`でコンテナを立ち上げ
2. `make migratge`でマイグレーションを適応/Prisma clientを生成
3. `make seed`で仮データをdbに追加
