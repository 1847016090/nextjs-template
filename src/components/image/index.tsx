"use client";

import Img, { ImageProps, ImageLoaderProps } from "next/image";

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export default function Image(props: ImageProps) {
  return <Img {...props} loader={imageLoader} />;
}
