// src/api/image/uploadToS3.ts
/** Web용 PUT: File/Blob을 그대로 업로드 */
export async function putToS3(presignedUrl: string, file: File, contentType: string) {
    const putRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
    });
    if (!putRes.ok) {
        const text = await putRes.text().catch(() => "");
        throw new Error(`S3 업로드 실패: ${putRes.status} ${text}`);
    }
}
