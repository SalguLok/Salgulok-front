import api from "../api";

//내 로그의 템플릿 삭제
export const deleteTemplates = async (
  logId: number,
  entryId: number,
  templateId: number
) => {
  try {
    const response = await api.delete(
      `/logs/${logId}/entries/${entryId}/templates/${templateId}`
    );
    return response;
  } catch (err: any) {
    throw err;
  }
};
