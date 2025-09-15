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
