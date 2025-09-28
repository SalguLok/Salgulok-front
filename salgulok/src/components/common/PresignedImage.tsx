import { useState, useEffect, FC } from "react";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";

const PresignedImage: FC<{
  objectKey?: string | null;
  src?: string;
  [key: string]: any;
}> = ({ objectKey, src, ...props }) => {
  const [finalUrl, setFinalUrl] = useState(src || "");

  useEffect(() => {
    // If a direct src is provided, use it.
    if (src) {
      setFinalUrl(src);
      return;
    }

    // If no src, but an objectKey is provided, fetch the presigned URL.
    if (objectKey) {
      let isMounted = true;
      const fetchUrl = async () => {
        try {
          const res = await issueGetPresigned(objectKey);
          if (isMounted) {
            if (res.items && res.items.length > 0) {
              setFinalUrl(res.items[0].presignedUrl);
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
    
    // If neither src nor objectKey is provided, clear the URL.
    setFinalUrl("");

  }, [objectKey, src]);

  if (!finalUrl) return <div {...props} style={{ ...props.style, backgroundColor: '#f0f0f0' }} />; // Placeholder for missing image

  return <img src={finalUrl} {...props} />;
};

export default PresignedImage;
