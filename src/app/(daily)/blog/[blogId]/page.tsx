import React, { memo } from "react";
import { Image } from "@/components";

const BlogDetail = (props: { params: { blogId: string } }) => {
  return (
    <div>
      博客ID: {props.params.blogId}
      <div className="relative w-full h-80">
        <Image
          src="https://imgs-1257212764.cos.ap-chengdu.myqcloud.com/nextjs-app-router-template/doc-images/6294.png"
          fill
          alt="博客图片"
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default BlogDetail;
