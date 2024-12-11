import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full max-w-sm border border-teal-500 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[200px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="p-4 flex flex-col justify-between h-[200px]">
        <p className="text-lg font-semibold line-clamp-2 transition-colors duration-300 group-hover:text-teal-500">
          {post.title}
        </p>
        <Link
          to={`/post/${post.slug}`}
          className="mt-auto border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
