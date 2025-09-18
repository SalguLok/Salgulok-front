import { FC, useState, useEffect } from "react";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";

const PresignedImage: FC<{
  objectKey?: string | null;
  src?: string;
  [key: string]: any;
}> = ({ objectKey, ...props }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!objectKey) {
      setUrl("");
      return;
    }

    const fetchUrl = async () => {
      try {
        const res = await issueGetPresigned(objectKey);
        if (res.items && res.items.length > 0) {
          setUrl(res.items[0].presignedUrl);
        } else {
          setUrl("");
        }
      } catch (e) {
        console.error("Failed to get presigned URL", e);
        setUrl("");
      }
    };

    fetchUrl();
  }, [objectKey]);

  if (!url) return <div {...props} />;

  return <img src={url} {...props} />;
};

export default PresignedImage;
