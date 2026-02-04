'use client';

import { useState } from 'react';
import { CreateCloudPostRequest, CreateCloudPostResponse } from '@cloudication/shared-types';

export default function PostForm() {
  const [formData, setFormData] = useState<CreateCloudPostRequest>({
    content: '',
    image_token: 'valid-token', // Mock default
    lat: 35.6812,
    lng: 139.7671,
    client_id: 'test-client',
  });
  const [result, setResult] = useState<CreateCloudPostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/cloud-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data: CreateCloudPostResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-md">
      <h2 className="text-xl font-bold mb-4">Create Cloud Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Content</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium">Lat</label>
            <input
              type="number"
              step="any"
              className="w-full border p-2 rounded"
              value={formData.lat}
              onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Lng</label>
            <input
              type="number"
              step="any"
              className="w-full border p-2 rounded"
              value={formData.lng}
              onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Image Token</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={formData.image_token}
            onChange={(e) => setFormData({ ...formData, image_token: e.target.value })}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="font-bold text-green-700">Success!</p>
          <p className="text-sm">ID: {result.post_id}</p>
          <p className="text-sm">Expires: {result.expires_at}</p>
        </div>
      )}
    </div>
  );
}
