import api from "../api";
import type { PresignedUrlRequest, PresignedUrlResponse } from "./types";

/** 업로드용 Presigned URL 발급 (POST /images/presigned) */
export async function issuePresigned(req: PresignedUrlRequest) {
    const { data } = await api.post<PresignedUrlResponse>("/images/presigned", req);
    return data;
}
