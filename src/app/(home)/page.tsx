import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>我的日常</h1>
      <ul>
        <li>
          <Link href={`/blog`}>博客</Link>
        </li>
      </ul>
      <h1>我的喜欢</h1>
      <ul>
        <li>
          <Link href={`/video`}>视频</Link>
        </li>
        <li>
          <Link href={`/article`}>文章</Link>
        </li>
      </ul>
    </main>
  );
}
