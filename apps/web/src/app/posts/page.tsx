import PostListView from "@/features/posts/components/PostListView";

export const metadata = {
  title: "最近の雲 | Cloudication",
  description: "みんなが投稿した最近の雲をチェックしましょう。",
};

export default function PostsPage() {
  return (
    <main className="min-h-screen bg-surface">
      <PostListView />
    </main>
  );
}
