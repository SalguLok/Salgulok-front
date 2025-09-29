import { useState, useEffect, useRef } from "react";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";
import type { FC } from "react";

// In-memory cache for presigned URLs
const presignedUrlCache = new Map<string, { url: string; expiry: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const PresignedImage: FC<{
  objectKey?: string | null;
  src?: string;
  [key: string]: any;
}> = ({ objectKey, src, ...props }) => {
  const [finalUrl, setFinalUrl] = useState(src || "");
  const imgRef = useRef<HTMLImageElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (imgRef.current) {
            observer.unobserve(imgRef.current);
          }
        }
      },
      { rootMargin: "0px 0px 200px 0px" } // Pre-load images 200px before they enter the viewport
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;

    if (src) {
      setFinalUrl(src);
      return;
    }

    if (objectKey) {
      const cached = presignedUrlCache.get(objectKey);
      if (cached && cached.expiry > Date.now()) {
        setFinalUrl(cached.url);
        return;
      }

      let isMounted = true;
      const fetchUrl = async () => {
        try {
          const res = await issueGetPresigned(objectKey);
          if (isMounted) {
            if (res.items && res.items.length > 0) {
              const newUrl = res.items[0].presignedUrl;
              setFinalUrl(newUrl);
              presignedUrlCache.set(objectKey, {
                url: newUrl,
                expiry: Date.now() + CACHE_DURATION,
              });
            } else {
              setFinalUrl("");
            }
          }
        } catch (e) {
          console.error("Failed to get presigned URL", e);
          if (isMounted) {
            setFinalUrl("");
          }
        }
      };

      fetchUrl();

      return () => {
        isMounted = false;
      };
    }

    setFinalUrl("");
  }, [objectKey, src, isIntersecting]);

  if (!finalUrl) {
    return (
      <div
        ref={imgRef as any}
        {...props}
        style={{ ...props.style, backgroundColor: "#f0f0f0" }}
      />
    ); // Placeholder
  }

  return <img ref={imgRef} src={finalUrl} {...props} />;
};

export default PresignedImage;
