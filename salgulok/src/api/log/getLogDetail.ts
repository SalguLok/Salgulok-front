// src/api/log/getLogDetail.ts
import api from "../api";

export type LogDetailResponse = {
    title: string;
    oneReview: string;
    startDate: string; // "YYYY-MM-DD"
    endDate: string;   // "YYYY-MM-DD"
    isPublic: boolean;
    regionId: number;
    imgUrl: string;
    isUpload?: boolean;
    ownerId: number;
    likes?: number;
    isLiked?: boolean; // 현재 로그인 사용자의 좋아요 여부 (백엔드 신규 필드)
};

export async function getLogDetail(logId: number): Promise<LogDetailResponse> {
    const { data } = await api.get<LogDetailResponse>(`/logs/${logId}`);
    return data;
}
