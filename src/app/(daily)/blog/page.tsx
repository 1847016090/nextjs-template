import Link from "next/link";

const BLOGS = [...new Array(100)].map((_, index) => index);
const MORE_BLOGS = [...new Array(200)].map((_, index) => index);

const Blog = ({ searchParams }: { searchParams: { more: true } }) => {
  const blogs = searchParams.more ? MORE_BLOGS : BLOGS;
  return (
    <div className="p-4">
      <h1>我的博客界面</h1>
      <ul>
        {blogs.map((b) => (
          <li key={b}>
            <Link href={`/blog/${b}`}>博客{b}</Link>
          </li>
        ))}
      </ul>
      <Link href={`/blog?more=true`} scroll={false}>
        <button>加载更多</button>
      </Link>
    </div>
  );
};

export default Blog;
