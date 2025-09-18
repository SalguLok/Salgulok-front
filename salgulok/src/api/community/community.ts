// src/api/community/community.ts

// import api from '../api'; 
import api from './client'; // client.ts에서 생성한 axios 인스턴스 사용


// ================== 1. 타입 정의 ==================

export type Topic = '동행' | '맛집' | '숙소' | '교통' | '기타';
export type StayStatus = 'STAYING' | 'ALL'; // 체류여부 필터링을 위한 타입

// 서버 응답 타입
export interface PostResponse {
  id: number;
  authorId: number;
  username: string;
  region: string;
  topic: Topic;
  content: string;
  authorStaying: boolean;
  createdAt: string;
  authorProfileImg?: string;
}

export interface CommentResponse {
  id: number;
  postId: number;
  authorId: number;
  username: string;
  content: string;
}

// 페이지네이션 응답을 위한 제네릭 타입
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// API 요청 시 필요한 데이터 타입
export interface GetPostsParams {
  regionId?: number; // regionId 속성 추가
  region?: string;
  topic?: Topic;
  status?: StayStatus;
  page?: number;
  size?: number;
}

export interface PostCreateRequest {
  topic: Topic;
  content: string;
  authorId: number;  // ★ 추가
  regionId: number;  // ★ 지역 ID 추가
}

export interface CommentCreateRequest {
  content: string;
  authorId: number;
}


export const parseKst = (s?: string) => {
  if (!s) return null;
  const iso = s.includes('T') ? s : s.replace(' ', 'T');
  const d = new Date(iso);
  return isNaN(+d) ? null : d;
};


// ================== 2. API 클라이언트 함수 ==================

// 1. 게시글 목록 조회 (검색 포함)
export const getPosts = async (params: GetPostsParams): Promise<Page<PostResponse>> => {
  const { data } = await api.get<Page<PostResponse>>('/community/posts', { params });
  return data;
};

// 2. 게시글 상세 조회
export const getPostById = async (postId: number): Promise<PostResponse> => {
  const { data } = await api.get<PostResponse>(`/community/posts/${postId}`);
  return data;
};

// 2.1. 게시글의 댓글 목록 조회
// export const getCommentsByPostId = async (postId: number): Promise<CommentResponse[]> => {
//   const { data } = await api.get<CommentResponse[]>(`/community/posts/${postId}/comments`);
//   //return data;
//   return data ?? []; // ★ 배열로 평탄화해서 돌려줌
// };
export const getCommentsByPostId = async (
  postId: number,
  page = 0,
  size = 20
): Promise<CommentResponse[]> => {
  const { data } = await api.get<Page<CommentResponse>>(
    `/community/posts/${postId}/comments`,
    { params: { page, size } }
  );
  return data?.content ?? [];   // ← Page 객체에서 배열만 꺼내서 반환
};

// 3. 게시글 생성
export const createPost = async (postData: PostCreateRequest): Promise<{ postId: number }> => {
  const response = await api.post<number>('/community/posts', postData);
  // 서버에서 직접 숫자를 반환하므로 객체로 감싸서 반환
  return { postId: response.data };
};

// 4. 게시글 삭제
export const deletePost = async (postId: number): Promise<void> => {
  await api.delete(`/community/posts/${postId}`);
};

// 5. 댓글 생성
export const createComment = async (postId: number, commentData: CommentCreateRequest): Promise<CommentResponse> => {
  const { data } = await api.post<CommentResponse>(`/community/posts/${postId}/comments`, commentData);
  return data;
};

// 6. 댓글 삭제
export const deleteComment = async (postId: number, commentId: number): Promise<void> => {
  await api.delete(`/community/posts/${postId}/comments/${commentId}`);
};
