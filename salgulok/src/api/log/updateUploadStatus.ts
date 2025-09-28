import api from "../api";

export interface UpdateUploadStatusRequest {
  isUpload: boolean;
}

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
