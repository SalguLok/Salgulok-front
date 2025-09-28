import api from "../api";

/** 사용자가 특정 로그에 좋아요를 눌렀는지 확인 (백엔드: GET /logs/{logId}/is-liked) */
export async function checkIfLiked(logId: number): Promise<boolean> {
  try {
    const { data } = await api.get<boolean>(`/logs/${logId}/is-liked`);
    return data;
  } catch (err) {
    console.error("좋아요 상태 조회 실패:", err);
    // 실패 시 기본값 false 반환 또는 에러를 다시 throw 할 수 있습니다.
    // 여기서는 UI가 깨지지 않도록 false를 반환합니다.
    return false;
  }
}
