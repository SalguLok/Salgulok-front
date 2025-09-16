// 백엔드 DTO와 1:1 매칭

export interface PresignedUrlRequest {
    templateId?: number | null;
    files: Array<{
        fileName: string;
        contentType: string;
        size?: number;
    }>;
}

export interface PresignedUrlItem {
    fileName: string | null;
    objectKey: string;
    presignedUrl: string;
    contentType: string;
    expiresInSec: number;
}

export interface PresignedUrlResponse {
    items: PresignedUrlItem[];
}

export interface ImageConfirmRequest {
    //templateId?: number | null;
    items: Array<{
        objectKey: string;
        url?: string;
        fileName?: string;
        contentType?: string;
        size?: number;
    }>;
}

export interface ImageConfirmResponse {
    imageIds: number[];
}
