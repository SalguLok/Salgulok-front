import api from "../api";

//살구록 작성여부 API
export const getLogFillStates = async (logId: number) => {
  try {
    const response = await api.get(`logs/${logId}/entries/fill-states`);
    return response;
  } catch (err) {
    console.error(err);
  }
};

//인기 살구록 API
export const getPopularLogs = async () => {
  try {
    const response = await api.get(`/logs/popular`);
    return response;
  } catch (err) {
    console.error(err);
  }
};

// 로그 댓글 관련 API들을 re-export
export {
  createLogComment,
  getLogComments,
  deleteLogComment,
  type LogCommentResponse,
  type LogCommentCreateRequest,
  type LogCommentCreateResponse,
  type GetLogCommentsParams,
  type Page as LogCommentPage
} from './logComment';
