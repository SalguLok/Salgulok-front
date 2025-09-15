import api from "../api";

export interface UpdateUserProfileRequest {
  username: string;
  intro?: string | null;
  profileImg?: string | null;
}

export interface UserResponse {
  nickname: string;
  intro: string | null;
  profileImg: string | null;
}

// 본인 프로필 수정
export const updateUserProfile = async (
  data: UpdateUserProfileRequest
): Promise<UserResponse> => {
  try {
    const response = await api.patch<UserResponse>("/users/me", data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert(error.response.data?.message || "프로필 수정 중 오류가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};
