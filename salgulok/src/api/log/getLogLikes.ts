import api from "../api";

/** 좋아요 수 조회 (백엔드: GET /logs/{logId}/likes, Long 반환) */
export async function getLogLikes(logId: number): Promise<number> {
    try {
        const { data } = await api.get<number>(`/logs/${logId}/likes`);
        return data;
    } catch (err) {
        console.error("좋아요 수 조회 실패:", err);
        throw err;
    }
}

/** 좋아요 누르기 (백엔드: POST /logs/{logId}/likes) */
export async function likeLog(logId: number): Promise<void> {
    try {
        await api.post(`/logs/${logId}/likes`);
    } catch (err) {
        console.error("좋아요 추가 실패:", err);
        throw err;
    }
}

/** 좋아요 취소 (백엔드: DELETE /logs/{logId}/likes) */
export async function unlikeLog(logId: number): Promise<void> {
    try {
        await api.delete(`/logs/${logId}/likes`);
    } catch (err) {
        console.error("좋아요 취소 실패:", err);
        throw err;
    }
}
