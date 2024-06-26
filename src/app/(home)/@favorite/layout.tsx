import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="flex gap-2">
        <Link href="/recommend-articles">推荐文章</Link>
        <Link href="/recommend-videos">推荐视频</Link>
      </nav>
      <div>{children}</div>
    </>
  );
}
