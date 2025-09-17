// src/api/image/uploadFlow.ts
import { issuePresigned } from "./issuePresigned";
import { confirmUpload } from "./confirmUpload";
import { putToS3 } from "./uploadToS3";
import type {
    PresignedUrlRequest,
    PresignedUrlItem,
    ImageConfirmRequest,
    ImageConfirmResponse,
} from "./types";

/** 파일 업로드 입력 타입 (Web) */
export interface LocalFile {
    file: File; //
}

/** 결과 타입은 동일 */
export interface UploadFlowResult {
    imageIds: number[];
    items: PresignedUrlItem[];
}

/** 발급→업로드→확정 */
export async function uploadImagesFlow(
    files: LocalFile[],
    options?: { templateId?: number | null }
): Promise<UploadFlowResult> {
    // 1) Presigned 발급 (File에서 메타 추출)
    const presigned = await issuePresigned({
        templateId: options?.templateId ?? null,
        files: files.map(({ file }) => ({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
        })),
    } as PresignedUrlRequest);

    if (presigned.items.length !== files.length) {
        throw new Error("발급된 presigned 개수가 요청 파일 수와 다릅니다.");
    }

    // 2) S3 PUT (File 그대로 전송)
    for (let i = 0; i < files.length; i++) {
        const item = presigned.items[i];
        const f = files[i].file;
        await putToS3(item.presignedUrl, f, f.type);
    }


    // 3) confirm
    const confirmBody: ImageConfirmRequest = {
        //templateId: options?.templateId ?? null,
        items: presigned.items.map((it, idx) => ({
            objectKey: it.objectKey,
            fileName: files[idx].file.name,
            contentType: files[idx].file.type,
            size: files[idx].file.size,
        })),
    };
    const confirmed: ImageConfirmResponse = await confirmUpload(confirmBody);

    return {
        imageIds: confirmed.imageIds ?? [],
        items: presigned.items,
    };
}
