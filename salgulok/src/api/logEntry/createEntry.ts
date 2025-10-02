import api from "../api";

export interface TemplateCreateRequest {
  placeId: number;
  text?: string;          
  star: number;
  imageIds?: number[];
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

// 기존 LogEntry에 새 템플릿 추가
export const addTemplateToEntry = async (
  logId: number,
  entryId: number,
  templateData: TemplateCreateRequest
): Promise<{
  templateId: number;
  placeId: number;
  text: string;
  star: number;
  images: Array<{ 
    imageId: number; 
    objectKey: string; 
    imageUrl: string;
    presignedUrl: string;
  }>;
}> => {
  try {
    const { data } = await api.post<{
      templateId: number;
      placeId: number;
      text: string;
      star: number;
      images: Array<{ 
        imageId: number; 
        objectKey: string; 
        imageUrl: string;
        presignedUrl: string;
      }>;
    }>(`/logs/${logId}/entries/${entryId}/templates`, templateData);
    return data;
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert(error.response.data.message || "템플릿 추가 중 문제가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};

// LogEntry 생성 (새 응답 구조)
export const createLogEntryWithResponse = async (
  logId: number,
  entryData: LogEntryCreateRequest
): Promise<{
  entryId: number;
  entryDate: string;
  templates: Array<{
    templateId: number;
    placeId: number;
    text: string;
    star: number;
    images: Array<{ 
      imageId: number; 
      objectKey: string; 
      imageUrl: string;
      presignedUrl: string;
    }>;
  }>;
}> => {
  try {
    const { data } = await api.post<{
      entryId: number;
      entryDate: string;
      templates: Array<{
        templateId: number;
        placeId: number;
        text: string;
        star: number;
        images: Array<{ 
          imageId: number; 
          objectKey: string; 
          imageUrl: string;
          presignedUrl: string;
        }>;
      }>;
    }>(`/logs/${logId}/entries`, entryData);
    return data;
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
