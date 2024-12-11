import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 px-3 py-10 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold lg:text-6xl">Explore the Bizlog Buzz</h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
          Here you'll find a variety of investors posting about their startups, educating about ideas, and sharing regular updates on the growing business world.
        </p>
        <Link
          to="/search"
          className="text-sm sm:text-base text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-3 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Check the Recent Posts Here...</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} className="shadow-md rounded-lg overflow-hidden" />
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
