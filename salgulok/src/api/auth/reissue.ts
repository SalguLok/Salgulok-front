import axios from "axios";

export interface ReissueResponse {
  accessToken: string;
}

// reissue 전용 axios (인터셉터 없음)
const reissueApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// accessToken 만료 시 reissue 요청
export async function reissue(): Promise<string> {
  try {
    const res = await reissueApi.post<ReissueResponse>("/auth/reissue");
    const newAccessToken = res.data.accessToken;

    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (err) {
    // 리프레시 토큰도 만료시 로그인 페이지로
    window.location.href = "/login";
    throw err;
  }
}