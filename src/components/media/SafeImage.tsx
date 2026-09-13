"use client";

import { images } from "@/config/images";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = images.placeholder;

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string;
};

export default function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  const handleError = () => {
    setImgSrc(FALLBACK_IMAGE);
  };

  return <Image {...props} src={imgSrc} alt={alt} onError={handleError} />;
}
