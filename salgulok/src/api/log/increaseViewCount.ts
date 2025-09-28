import api from "../api";

export async function increaseViewCount(logId: number): Promise<void> {
    try {
        await api.post(`/logs/${logId}/views`);
    } catch (error: any) {
        if (error.response) {
            console.error("서버 오류:", error.response.data);
            throw new Error(error.response.data.message || "조회수 증가 실패");
        } else {
            console.error("네트워크 오류:", error);
            throw new Error("네트워크 오류가 발생했습니다.");
        }
    }
}
