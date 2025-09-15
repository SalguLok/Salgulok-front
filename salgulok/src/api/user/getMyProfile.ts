import api from "../api";

export interface UserResponse {
  nickname: string;
  intro: string | null;
  profileImg: string | null;
}

// 마이페이지 내 정보 불러오기
export const getMyInfo = async (): Promise<UserResponse> => {
  try {
    const response = await api.get<UserResponse>("/users/me");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert("내 정보를 불러오는 중 문제가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};
