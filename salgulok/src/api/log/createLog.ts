import api from "../api";

export interface LogCreateRequest {
  title: string;
  startDate: string;   // LocalDate → 문자열(yyyy-MM-dd)로
  endDate: string;     // LocalDate → 문자열(yyyy-MM-dd)
  isPublic: boolean;
  regionId: number;
  imgUrl?: string;
  oneReview?: string;
}

// 로그 생성
export const createLog = async (logData: LogCreateRequest): Promise<void> => {
  try {
    await api.post("/logs", logData);
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert(error.response.data.message || "로그 생성 중 문제가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};
