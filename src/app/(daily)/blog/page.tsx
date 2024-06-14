import Link from 'next/link';

const BLOGS = [1, 2, 3, 4, 5];

const Blog = () => {
  return (
    <div className="p-4">
      <h1>我的博客界面</h1>
      <ul>
        {BLOGS.map((b) => (
          <li key={b}>
            <Link href={`/blog/${b}`}>博客{b}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
