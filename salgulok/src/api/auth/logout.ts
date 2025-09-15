import api from "../api";

// 로그아웃
export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");

    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  } catch (err) {
    console.error("로그아웃 실패:", err);

    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }
}
