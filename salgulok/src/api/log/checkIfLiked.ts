// src/api/log/checkIfLiked.ts
import api from "../api";

/**
 * 현재 로그인한 사용자가 특정 로그에 좋아요를 눌렀는지 확인
 * 백엔드: GET /logs/{logId}/is-liked
 *
 * @param logId 확인할 로그 ID
 * @returns true: 좋아요 누름, false: 누르지 않음
 */
export async function checkIfLiked(logId: number): Promise<boolean> {
  try {
    const { data } = await api.get<boolean>(`/logs/${logId}/is-liked`);
    return data;
  } catch (err: any) {
    console.error("좋아요 상태 조회 실패:", err);
    // 인증 안 됐거나 에러 발생 시 기본값 false 반환
    return false;
  }
}
