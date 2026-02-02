'use client';

import { useEffect, useState } from 'react';
import { CloudPost } from '@cloudication/shared-types';

export default function PostList() {
  const [posts, setPosts] = useState<CloudPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cloud-posts');
      if (response.ok) {
        const data: CloudPost[] = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4 border rounded shadow-md bg-white w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Cloud Posts</h2>
        <button 
          onClick={fetchPosts}
          className="text-sm text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts found.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="border-b pb-2">
                <p className="font-semibold">{post.content}</p>
                <div className="text-xs text-gray-500 flex gap-4 mt-1">
                  <span>Likes: {post.likes_count}</span>
                  <span>
                    Location: {post.lat?.toFixed(4)}, {post.lng?.toFixed(4)}
                  </span>
                  <span>Expires: {post.expires_at ? new Date(post.expires_at).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
