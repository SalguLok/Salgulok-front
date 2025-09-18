import api from "../api";
import { issueGetPresigned } from "../image/issueGetPresigned";
import type { PresignedUrlResponse } from "../image/types";

export type LogEntryDateItem = {
    entryId: number;
    entryDate: string;                // "YYYY-MM-DD"
    thumbnailObjectKey: string | null;
    templateCount: number | null;
};

export type LogEntryDateListResponse = {
    logId: number;
    items: LogEntryDateItem[];
};

export type LogEntryDateItemWithUrl = Omit<LogEntryDateItem, "thumbnailObjectKey"> & {
    thumbnailUrl: string | null;
};

export type LogEntryDateListWithUrlsResponse = {
    logId: number;
    items: LogEntryDateItemWithUrl[];
};

/** ✅ 원본 데이터 가져오는 named export */
export async function getEntryDates(logId: number): Promise<LogEntryDateListResponse> {
    const { data } = await api.get<LogEntryDateListResponse>(`/logs/${logId}/entries/dates`);
    return data;
}

/** (옵션) presigned URL까지 변환해서 주는 헬퍼 */
export async function getEntryDatesWithPresignedUrls(
    logId: number
): Promise<LogEntryDateListWithUrlsResponse> {
    const response = await getEntryDates(logId);

    const itemsWithUrls = await Promise.all(
        response.items.map(async (item) => {
            let thumbnailUrl: string | null = null;

            if (item.thumbnailObjectKey) {
                try {
                    const presigned: PresignedUrlResponse = await issueGetPresigned(item.thumbnailObjectKey);
                    thumbnailUrl = presigned.presignedUrl;
                } catch (e) {
                    console.error("presigned 실패:", item.thumbnailObjectKey, e);
                }
            }

            const { thumbnailObjectKey, ...rest } = item;
            return { ...rest, thumbnailUrl };
        })
    );

    return { logId: response.logId, items: itemsWithUrls };
}
