import api from "../api";

export interface LogCheckRequest {
  startDate: string;
  endDate: string;
}

export interface LogDateCheckResponse {
  alreadyExist: boolean;
}

// 여행날짜 중복 체크
export const checkLogDate = async (request: LogCheckRequest): Promise<LogDateCheckResponse> => {
  try {
    const response = await api.post<LogDateCheckResponse>("/logs/checkDate", request);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert(error.response.data.message || "날짜 확인 중 문제가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};
