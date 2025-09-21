import api from "../api";

export type TemplateSingleUpdateRequest = {
  text?: string | null;
  star?: number | null;
  imageIds?: number[] | null;
};

export type TemplateUpdateResponse = {
  templateId: number;
  placeId: number;
  text: string;
  star: number;
  images: Array<{ imageId: number; objectKey: string; imageUrl: string }>;
};

export const patchTemplate = async (
  logId: number,
  entryId: number,
  templateId: number,
  body: TemplateSingleUpdateRequest
): Promise<TemplateUpdateResponse> => {
  const payload: TemplateSingleUpdateRequest = {};
  if (body.text !== undefined) payload.text = body.text;
  if (body.star !== undefined) payload.star = body.star;
  if (body.imageIds !== undefined) payload.imageIds = body.imageIds;

  const { data } = await api.patch<TemplateUpdateResponse>(
    `/logs/${logId}/entries/${entryId}/templates/${templateId}`,
    payload
  );
  return data;
};
