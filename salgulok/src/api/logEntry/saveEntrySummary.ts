import api from "../api";

// 로그 엔트리 하루요약 저장
export const saveEntrySummary = async (
  logId: number,
  entryId: number,
  summary: string
): Promise<void> => {
  try {
    await api.put(`/logs/${logId}/entries/${entryId}/summary`, summary, {
      headers: {
        "Content-Type": "text/plain", // 문자열이니까 text/plain
      },
    });
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert("요약 저장 중 문제가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};
