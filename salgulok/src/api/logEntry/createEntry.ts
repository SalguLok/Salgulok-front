// import api from "../api";

// export interface TemplateCreateRequest {
//   placeId: number;
//   text?: string;          
//   star: number;
//   imageIds?: number[]; // 권장
//   images?: {
//     objectKey: string;
//     url?: string;
//     fileName?: string;
//     contentType?: string;
//     size?: number;
//   }[]; // 호환
// }

// export interface LogEntryCreateRequest {
//   entryDate: string; // "YYYY-MM-DD"
//   templates: TemplateCreateRequest[];
// }

// // 로그 엔트리 생성
// export const createLogEntry = async (
//   logId: number,
//   entryData: LogEntryCreateRequest
// ): Promise<void> => {
//   try {
//     await api.post(`/logs/${logId}/entries`, entryData);
//   } catch (error: any) {
//     if (error.response) {
//       console.error("서버 오류:", error.response.data);
//       alert(error.response.data.message || "로그 엔트리 생성 중 문제가 발생했습니다.");
//     } else {
//       console.error("네트워크 오류:", error);
//       alert("네트워크 오류가 발생했습니다.");
//     }
//     throw error;
//   }
// };
import api from "../api";

export interface TemplateCreateRequest {
  placeId: number;
  text?: string;
  star: number;
  imageIds?: number[]; // 서버 사용
  images?: {           // 클라 내부용, 전송 시 제거
    objectKey: string;
    url?: string;
    fileName?: string;
    contentType?: string;
    size?: number;
  }[];
}

export interface LogEntryCreateRequest {
  entryDate: string;         // "YYYY-MM-DD"
  templates: TemplateCreateRequest[];
}

// 유효한 숫자 배열만 통과
const toSafeIds = (ids?: number[]) =>
  Array.isArray(ids) && ids.length > 0 && ids.every(n => Number.isInteger(n)) ? ids : undefined;

// 로그 엔트리 생성
export const createLogEntry = async (
  logId: number,
  entryData: LogEntryCreateRequest
): Promise<void> => {
  try {
    // ✅ 서버 스펙에 맞게 정제( images 필드는 제거 )
    const payload = {
      entryDate: entryData.entryDate,
      templates: entryData.templates.map(t => ({
        placeId: t.placeId,
        text: t.text,
        star: t.star,
        imageIds: toSafeIds(t.imageIds), // 잘못된 값이면 자동으로 제외
      })),
    };

    const res = await api.post(`/logs/${logId}/entries`, payload);

    // (선택) Location 헤더 쓰고 싶으면 여기서 확인
    // const location = res.headers?.location;
    // console.log("Created:", location);

  } catch (error: any) {
    // 디버깅용 상세 로그
    console.error("raw error:", error);
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.error("status:", status);
    console.error("data:", data);

    // 서버 표준 에러 포맷(code/message)이면 그대로 표시
    const msg = data?.message || data?.error || "로그 엔트리 생성 중 문제가 발생했습니다.";
    const code = data?.code ? `[${data.code}] ` : "";
    alert(code + msg);
    throw error;
  }
};
