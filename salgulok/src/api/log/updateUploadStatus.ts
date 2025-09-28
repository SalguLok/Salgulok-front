import api from "../api";

export interface LogUploadUpdateRequest {
    isUpload: boolean;
}

/**
 * 살구록 업로드 상태 토글 (게시/비게시)
 * @param logId 살구록 ID
 * @param isUpload true = 업로드(게시), false = 비게시
 */
export const updateUploadStatus = async (
    logId: number,
    isUpload: boolean
): Promise<void> => {
    try {
        await api.patch(`/logs/${logId}/upload`, { isUpload });
    } catch (error: any) {
        if (error.response) {
            console.error("서버 오류:", error.response.data);
            throw new Error(error.response.data.message || "업로드 상태 변경 실패");
        } else {
            console.error("네트워크 오류:", error);
            throw new Error("네트워크 오류 발생");
        }
    }
};
