import api from "../api";

// 카카오톡 로그인
interface LoginResponse {
  accessToken: string;
  newUser: boolean;
  userId: number;
}

export const sendKakaoCode = async (code: string): Promise<LoginResponse> => {
    try{
        const response = await api.post<LoginResponse>("/auth/login", { code });
        const accessToken = response.data.accessToken;
        //userId localstorage 에 필요해서!! api 호출보다 이게 빠를거같아서 추가햇더요
        //const userId = response.data.userId;
        localStorage.setItem("userId", response.data.userId.toString());
        localStorage.setItem("accessToken", accessToken);
        return response.data;
    } catch (error){
        console.error("카카오톡 로그인 실패");
        throw error;
    }
};