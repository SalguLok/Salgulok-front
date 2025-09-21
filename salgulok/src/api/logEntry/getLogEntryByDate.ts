import api from "../api";

const toYmd = (d: Date | string) =>
  typeof d === "string" ? d : d.toISOString().slice(0, 10);

export interface LogEntryByDate {
  logId: number;
  entryDate: string;
  entryId: number;
  templateCount: number;
  templates: Array<{
    templateId: number;
    placeId: number;
    text: string;
    star: number;
    images?: Array<{ imageId: number; imageUrl: string }>;
    imageUrls?: string[];
  }>;
}

export async function getLogEntryByDate(
  logId: number,
  date: Date | string
): Promise<LogEntryByDate> {
  const { data } = await api.get<LogEntryByDate>(
    `/logs/${logId}/entries/by-date`,
    { params: { date: toYmd(date) } }
  );
  return data;
}
