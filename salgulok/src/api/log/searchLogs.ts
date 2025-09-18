// src/api/log/searchLogs.ts
import api from "../api";

export interface LogItem {
    // 백엔드 LogResponse 기준(필요한 것만 우선 명세)
    title: string;
    startDate: string;   // "2025-09-18" 같은 ISO-8601 날짜 문자열
    endDate: string;
    isPublic: boolean;
    regionId: number;
    imgUrl?: string | null;
    oneReview?: string | null;

    // 리스트라면 보통 식별자가 필요해요. 백엔드에 따라 key 이름이 다를 수 있어 optional로 둡니다.
    logId?: number;
    id?: number;

    // 추후 확장(조회수, 좋아요 등)
    view?: number;
    likeCount?: number;
    createdAt?: string;
    [key: string]: unknown;
}

export interface LogListResponse {
    logs: LogItem[];     // 팀 규칙에 맞춰 변경 가능(예: content, data 등)
    totalCount?: number;  // 페이징 필요시 백엔드와 합의해서 사용
}

/** 살구록 검색 (GET /logs?search=...) */
export async function searchLogs(
    query: string,
    opts?: { signal?: AbortSignal }
): Promise<LogListResponse> {
    const { data } = await api.get<LogListResponse>("/logs", {
        params: { search: query },
        signal: opts?.signal,
    });
    return data;
}
