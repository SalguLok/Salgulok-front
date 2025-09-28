import api from "../api";

export interface UploadToggleRequest {
  isUpload: boolean;
}

export async function setLogUploadStatus(
  logId: number,
  body: UploadToggleRequest
): Promise<void> {
  await api.patch(`/logs/${logId}/upload`, body);
}


