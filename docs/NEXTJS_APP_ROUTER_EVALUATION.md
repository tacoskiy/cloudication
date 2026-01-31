# Next.js App Router 構造評価レポート

このドキュメントは、本プロジェクトのフロントエンド構造を **Next.js App Router のベストプラクティス** の観点で評価した結果です。

---

## 総合評価: **B+（良い基盤、いくつか改善余地あり）**

App Router の基本方針に沿った構成になっており、Server/Client の境界も意識されています。一方で、ルーティング周りの UX・堅牢性・ディレクトリ設計に改善の余地があります。

---

## 良い点（ベストプラクティスに沿っている部分）

### 1. **App Router の基本構造**
- `src/app/` 配下に `layout.tsx`・`page.tsx` があり、ファイルベースルーティングが正しく使われている。
- ルートレイアウトで `metadata` を export しており、SEO と一貫したメタデータ管理ができている。
- `next/font`（Geist）でフォントを読み込み、CSS 変数と連携している。

### 2. **Server / Client の境界**
- ルート `layout.tsx` は Server Component のまま。
- クライアントが必要な部分（`CameraView`、`CameraProvider`、`test-api/page`）にのみ `"use client"` を付与している。
- 必要最小限のコンポーネントだけを Client Component にしており、デフォルトで Server Component にする方針が守られている。

### 3. **レイアウトとプロバイダの分離**
- 共通 UI（`Header`）をルートレイアウトに配置し、全ページで共有している。
- `AppProviders` でプロバイダを集約し、レイアウトから 1 箇所で注入している。

### 4. **ディレクトリ構成**
- `components/`・`hooks/`・`lib/`・`providers/`・`contexts/` を `src` 直下に置き、役割ごとに分離している。
- `components` を `common/` と `layout/` に分け、用途が分かりやすい。

### 5. **スタイル**
- Tailwind v4 と CSS 変数（`:root` + `@theme`）でテーマを定義している。
- グローバルスタイルは `app/globals.css` に集約されている。

---

## 改善推奨事項

### 1. **ルートレイアウトの HTML 構造（優先度: 高）**

**現状:**  
`<AppProviders>` が `<html>` と `<body>` の間にあり、実 DOM では `<body>` の外にプロバイダが来る可能性がある。

```tsx
// 現状: html と body の間にコンポーネントが挟まる
<html>
  <AppProviders>
    <body>...</body>
  </AppProviders>
</html>
```

**推奨:**  
プロバイダは `<body>` の内側に置き、ドキュメント構造を正しく保つ。

```tsx
<html lang="ja">
  <body className={...}>
    <AppProviders>
      <Header />
      <main>{children}</main>
    </AppProviders>
  </body>
</html>
```

---

### 2. **ルートレイアウトの `metadata` 型（優先度: 中）**

**現状:**  
`metadata` は export されているが、`viewport` や `themeColor` などは未指定。

**推奨:**  
必要に応じて `viewport` や `themeColor` を追加し、PWA・モバイル表示を考慮する。

```ts
// layout.tsx
export const metadata: Metadata = {
  title: { default: "クモ二ケーション", template: "%s | クモ二ケーション" },
  description: "匿名雲投稿アプリ",
  // viewport は next 16 では別 export のケースあり
};
```

---

### 3. **`loading.tsx` / `error.tsx` / `not-found.tsx` の未整備（優先度: 高）**

**現状:**  
- `app/loading.tsx` がないため、初回表示時に React のサスペンス境界まで待つ可能性がある。
- `app/error.tsx` がないため、エラー時に Next のデフォルトエラー UI のみ。
- `app/not-found.tsx` がないため、404 が汎用のまま。

**推奨:**  
少なくとも以下を追加する。

| ファイル | 役割 |
|----------|------|
| `app/loading.tsx` | ルートおよびサブルートのローディング UI |
| `app/error.tsx` | ルートのエラーバウンダリ（「再試行」ボタンなど） |
| `app/not-found.tsx` | 404 用の専用ページ |

必要なら `test-api/loading.tsx` のようにルートごとの loading も検討。

---

### 4. **`next/link` の使用（優先度: 中）**

**現状:**  
`Header.tsx` で `<a href="###">` を使用している。

```tsx
<a href="###" className="...">
```

**推奨:**  
アプリ内遷移は `<Link>` にし、プリフェッチとクライアントナビゲーションを有効にする。

```tsx
import Link from "next/link";
// ...
<Link href="/" className="...">
```

`href="###"` は仮の値なので、実際のトップまたはロゴ用パス（例: `/`）に変更する。

---

### 5. **ルートグループの検討（優先度: 低〜中）**

**現状:**  
`app/` 直下に `page.tsx` と `test-api/page.tsx` のみ。今後、`(auth)`・`(dashboard)` のようにレイアウトやミドルウェアを分けたいルートが増える場合、ルートグループがないとレイアウトの重複や設定が煩雑になりやすい。

**推奨:**  
- 公開ページとダッシュボードなど「レイアウトの塊」がはっきりしてきた段階で、`(marketing)` / `(app)` などのルートグループを導入する。
- 現状の規模では必須ではないが、設計の選択肢として知っておくとよい。

---

### 6. **`test-api/page.tsx` のデータ取得（優先度: 中）**

**現状:**  
クライアントで `useEffect` + `apiFetch` により API を呼んでいる。このページは「API 動作確認」が目的なら現状でも成立する。

**選択肢:**  
- **Server Component にする:** 表示専用なら、`page.tsx` を async にしてサーバーで `apiFetch` し、クライアント state を減らせる。
- **現状のまま Client で取得:** フォームやボタンで再取得するなど、インタラクションがある場合はこのままでよい。

「テスト用」と割り切るなら現状維持でよく、本番向けページが増えたら上記のように Server での取得を検討するとよい。

---

### 7. **`apiFetch` の利用場所（優先度: 低）**

**現状:**  
`lib/apiFetch.ts` は async で `fetch` を使っている。Server Component からも利用可能だが、`NEXT_PUBLIC_*` を使っているため主にクライアントまたは Route Handler からの利用を想定した実装。

**推奨:**  
- Server Component からバックエンド API を叩く場合は、`apiFetch` をそのまま使うか、サーバー専用のラッパー（環境変数を `API_URL` にする等）を用意すると役割が明確になる。
- 現状は `test-api` のみの利用なら、大きな変更は不要。

---

### 8. **ディレクトリ構成の将来像（優先度: 低）**

**現状:**  
`components/` がフラットに近く、`app/` 配下に `components` を置いていない。

**ベストプラクティスの一例:**  
- **ルート/ページ専用 UI:** `app/(group)/**/components/` や `app/**/_components/` に置く（Colocation）。
- **共通 UI:** 従来通り `src/components/` でよい。

現状規模では `src/components/` のままでも問題ないが、特定ルートにしか使わないコンポーネントが増えたら、そのルート配下に `components` を置く形を検討するとよい。

---

## チェックリスト（今後の参照用）

| 項目 | 状態 |
|------|------|
| ルート `layout.tsx` で `metadata` を export | ✅ |
| Server Component をデフォルトにし、必要な部分だけ `"use client"` | ✅ |
| フォントを `next/font` で読み込み | ✅ |
| プロバイダを `<body>` 内に配置 | ❌ → 要修正 |
| 主要ルートに `loading.tsx` を用意 | ❌ |
| ルートに `error.tsx` を用意 | ❌ |
| `not-found.tsx` を用意 | ❌ |
| アプリ内リンクに `next/link` を使用 | ❌（Header） |
| ルートグループの検討（必要に応じて） | 未導入（現状は許容） |
| Colocation の検討（ルート専用 components） | 未導入（現状は許容） |

---

## まとめ

- **強み:** App Router の基本（ファイルルーティング、Server/Client の切り分け、メタデータ、フォント）が押さえられており、コンポーネント・プロバイダの分離も整理されている。
- **最優先で直したい点:**  
  1. ルートレイアウトでプロバイダを `<body>` の内側に移動する。  
  2. `loading.tsx`・`error.tsx`・`not-found.tsx` を追加する。  
  3. Header のリンクを `next/link` にし、`href` を適切なパスにする。

上記を反映すると、App Router の推奨パターンにかなり近い構成になります。
