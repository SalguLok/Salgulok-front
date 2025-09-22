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
  totalPages: number;
  currentPage: number;
}

// 내 로그 조회
export const getMyLogs = async (page: number = 0): Promise<LogListResponse> => {
  try {
    const response = await api.get<LogListResponse>(`/logs/my?page=${page}`);
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

//내 로그 삭제
export const deleteMyLogs = async (logId: number) => {
  try {
    const response = await api.delete(`/logs/${logId}`);
    return response;
  } catch (err: any) {
    throw err;
  }
};
