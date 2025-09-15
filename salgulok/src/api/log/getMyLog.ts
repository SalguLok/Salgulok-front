import api from "../api";

export interface LogResponse {
  logId: number;
  writer: string;
  writerProfile: string;
  title: string;
  startDate: string;   
  endDate: string;
  isPublic: boolean;
  regionId: number;
  imgUrl: string | null;
  oneReview: string | null;
}

export interface LogListResponse {
  logs: LogResponse[];
}

// 내 로그 조회
export const getMyLogs = async (): Promise<LogListResponse> => {
  try {
    const response = await api.get<LogListResponse>("/logs/my");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert("내 로그를 불러오는 중 문제가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};
