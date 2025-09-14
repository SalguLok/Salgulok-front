import api from "../api";

export interface ReissueResponse {
  accessToken: string;
}

// accessToken 만료 시 reissue 요청
export async function reissue(): Promise<string> {
  try {
    const res = await api.post<ReissueResponse>("/auth/reissue");
    const newAccessToken = res.data.accessToken;

    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (err) {
    // 리프레시 토큰도 만료 → 로그인 페이지로
    window.location.href = "/login";
    throw err;
  }
}
