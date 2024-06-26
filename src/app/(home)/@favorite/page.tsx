import Link from 'next/link';

const HomeFavorite = (props: any) => {
  return (
    <div>
      <h1>我的喜欢</h1>
      <ul>
        <li>
          <Link href={`/video`}>视频</Link>
        </li>
        <li>
          <Link href={`/article`}>文章</Link>
        </li>
        <li>
          <Link href={`/types`}>分类</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomeFavorite;
