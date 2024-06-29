import BannerImg from "@/assets/image/banner.jpg";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="relative h-[calc(100vh-120px)]">
        <Image
          src={BannerImg}
          alt="首页背景图"
          placeholder="blur"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </main>
  );
}
