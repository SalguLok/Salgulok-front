import api from "../api";

interface NicknameRequest {
    username: string;      
}

interface NicknameResponse{
    duplicate: boolean;
}

// 닉네임 중복 확인
export const nicknameDuplicate = async (data: NicknameRequest): Promise<NicknameResponse> => {
    try{
        const response = await api.post<NicknameResponse>("/users/duplicate", data);
        return response.data;
    } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        alert(data.message || "닉네임을 입력해주세요.");
      } else {
        console.error("서버 오류", data);
        alert("서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } else {
      console.error("네트워크 오류", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};