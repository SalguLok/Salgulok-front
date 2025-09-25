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
  likes: number;
  isUpload: boolean;
}

export interface LogListResponse {
  logs: LogResponse[];
  totalPages: number;
  currentPage: number;
}

// 로그 검색 및 필터링
export const searchLogs = async (
  keyword?: string,
  sort: "latest" | "view" | "like" = "latest",
  regionId: number = 0,
  page: number = 0
): Promise<LogListResponse> => {
  try {
    const response = await api.get<LogListResponse>("/logs/search", {
      params: {
        keyword,
        sort,
        regionId,
        page
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert("로그 목록을 불러오는 중 문제가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};
