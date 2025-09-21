import api from "../api";

const patchTemplate = async (
  logId: number,
  entryId: number,
  templateId: number
) => {
  try {
    const response = await api.patch(
      `/logs/${logId}/entries/${entryId}/templates/${templateId}`
    );
    return response;
  } catch (err) {
    console.error(err);
  }
};
