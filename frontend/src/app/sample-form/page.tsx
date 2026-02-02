import PostForm from '@/components/PostForm';
import PostList from '@/components/PostList';

export default function SampleFormPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Shared Types Integration Demo</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        <div className="w-full max-w-md">
          <PostForm />
        </div>
        
        <div className="w-full max-w-2xl">
          <PostList />
        </div>
      </div>
    </main>
  );
}
