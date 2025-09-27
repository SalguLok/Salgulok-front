// src/api/log/logComment.ts

import api from '../api';

// ================== 타입 정의 ==================

// 로그 댓글 응답 타입
export interface LogCommentResponse {
  id: number;
  logId: number;
  authorId: number;
  authorName: string;
  authorProfileImg?: string;
  content: string;
  createdAt: string;
}

// 로그 댓글 생성 요청 타입
export interface LogCommentCreateRequest {
  content: string;
}

// 로그 댓글 생성 응답 타입
export interface LogCommentCreateResponse {
  commentId: number;
}

// 페이지네이션 응답을 위한 제네릭 타입
export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// 로그 댓글 목록 조회 파라미터 타입
export interface GetLogCommentsParams {
  page?: number;
  size?: number;
  sort?: string;
}

// ================== API 함수 ==================

/**
 * 로그 댓글 생성
 * POST /logs/{logId}/comments
 */
export const createLogComment = async (
  logId: number,
  commentData: LogCommentCreateRequest
): Promise<LogCommentCreateResponse> => {
  try {
    const { data } = await api.post<LogCommentCreateResponse>(
      `/logs/${logId}/comments`,
      commentData
    );
    return data;
  } catch (error: any) {
    console.error("[API] 댓글 생성 에러:", error);
    if (error.response) {
      console.error("서버 응답:", error.response.status, error.response.data);
      alert(error.response.data.message || "댓글 생성 중 문제가 발생했습니다.");
    } else if (error.request) {
      console.error("요청 실패:", error.request);
      alert("서버에 연결할 수 없습니다.");
    } else {
      console.error("요청 설정 오류:", error.message);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};

/**
 * 로그 댓글 목록 조회 (페이징)
 * GET /logs/{logId}/comments?page=0&size=20&sort=createdAt
 */
export const getLogComments = async (
  logId: number,
  params: GetLogCommentsParams = {}
): Promise<Page<LogCommentResponse>> => {
  try {
    const { page = 0, size = 20, sort = 'createdAt' } = params;
    
    const { data } = await api.get<Page<LogCommentResponse>>(
      `/logs/${logId}/comments`,
      {
        params: { page, size, sort }
      }
    );
    return data;
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      alert("댓글 목록을 불러오는 중 문제가 발생했습니다.");
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};

/**
 * 로그 댓글 삭제
 * DELETE /logs/{logId}/comments/{commentId}
 */
export const deleteLogComment = async (
  logId: number,
  commentId: number
): Promise<void> => {
  try {
    await api.delete(`/logs/${logId}/comments/${commentId}`);
  } catch (error: any) {
    if (error.response) {
      console.error("서버 오류:", error.response.data);
      const status = error.response.status;
      if (status === 401) {
        alert("권한이 없습니다. 본인이 작성한 댓글만 삭제할 수 있습니다.");
      } else {
        alert(error.response.data.message || "댓글 삭제 중 문제가 발생했습니다.");
      }
    } else {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};
