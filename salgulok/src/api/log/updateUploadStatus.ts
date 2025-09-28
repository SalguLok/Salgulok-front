import api from "../api";

export interface UpdateUploadStatusRequest {
  isUpload: boolean;
}

/**
 * 살구록 업로드 상태(isUpload) 변경 API
 *
 * @param logId 살구록 ID
 * @param payload { isUpload: true } → 게시, { isUpload: false } → 게시 해제
 */
export async function updateUploadStatus(
    logId: number,
    payload: UpdateUploadStatusRequest
): Promise<void> {
  try {
    await api.patch(`/logs/${logId}/upload`, payload);
  } catch (error: any) {
    console.error("업로드 상태 변경 실패:", error);
    throw error;
  }
}
