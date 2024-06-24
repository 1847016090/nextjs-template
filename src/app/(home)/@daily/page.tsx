import Link from 'next/link';

const HomeDaily = () => {
  return (
    <div>
      <h1>我的日常</h1>
      <ul>
        <li>
          <Link href={`/blog`}>博客</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomeDaily;
