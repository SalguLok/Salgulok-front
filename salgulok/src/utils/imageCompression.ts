import imageCompression from 'browser-image-compression';

/**
 * 이미지를 압축하는 함수
 * @param imageFile 압축할 이미지 파일
 * @returns 압축된 이미지 파일
 */
export const compressImage = async (imageFile: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,          // 최대 파일 크기 (1MB)
    maxWidthOrHeight: 1920, // 최대 너비 또는 높이
    useWebWorker: true,    // 웹 워커 사용
    fileType: 'image/webp', // WebP 포맷으로 출력
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(
      `압축 성공: ${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(
        2
      )}MB) -> (${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`
    );
    return compressedFile;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
    // 압축에 실패하면 원본 파일을 그대로 반환
    return imageFile;
  }
};
