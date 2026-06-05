"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const fallback = "/placeholder.png";

export default function SafeImage({
  src,
  alt,
  ...props
}: {
  src?: string;
  alt: string;
  [key: string]: any;
}) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onErrorCapture={() => setImgSrc(fallback)}
    />
  );
}