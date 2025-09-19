import api from "../api";

export interface TemplateCreateRequest {
  placeId: number;
  text?: string;          
  star: number;
  imageUrls?: string[];
}

export interface LogEntryCreateRequest {
  entryDate: string; // "YYYY-MM-DD"
  templates: TemplateCreateRequest[];
}

// 로그 엔트리 생성
export const createLogEntry = async (
  logId: number,
  entryData: LogEntryCreateRequest
): Promise<void> => {
  try {
    await api.post(`/logs/${logId}/entries`, entryData);
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert(error.response.data.message || "로그 엔트리 생성 중 문제가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};
