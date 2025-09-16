import api from "../api";
import type { PresignedUrlResponse } from "./types";

/** 다운로드용 Presigned URL 발급 (GET /images/presigned?objectKey=...) */
export async function issueGetPresigned(objectKey: string) {
    const { data } = await api.get<PresignedUrlResponse>("/images/presigned", {
        params: { objectKey },
    });
    return data;
}
