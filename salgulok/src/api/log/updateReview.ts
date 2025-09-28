import api from "../api";

export interface UpdateReviewRequest {
    oneReview: string | null; // null 허용 (비우기 가능)
}

/**
 * 살구록 한줄평 수정/비우기 API
 *
 * @param logId 살구록 ID
 * @param payload { oneReview: "내용" } → 수정, { oneReview: null } → 비우기
 */
export async function updateReview(
    logId: number,
    payload: UpdateReviewRequest
): Promise<void> {
    try {
        await api.patch(`/logs/${logId}/review`, payload);
    } catch (error: any) {
        console.error("한줄평 수정 실패:", error);
        throw error;
    }
}
