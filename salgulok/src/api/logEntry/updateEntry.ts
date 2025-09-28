import api from "../api";

export interface TemplateUpdateRequest {
  templateId: number;
  text?: string;
  star: number;
  imageIds?: number[];
  images?: {
    objectKey: string;
    url?: string;
    fileName?: string;
    contentType?: string;
    size?: number;
  }[];
}

export interface LogEntryUpdateRequest {
  templates: TemplateUpdateRequest[];
}

// 하루 로그(엔트리) 수정
export const updateLogEntry = async (
  logId: number,
  entryId: number,
  data: LogEntryUpdateRequest
): Promise<void> => {
  try {
    await api.put(`/logs/${logId}/entries/${entryId}`, data);
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert(error.response.data.message || "하루로그 수정 중 문제가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};