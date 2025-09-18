import api from "../api";
import type { ImageConfirmRequest, ImageConfirmResponse } from "./types";

/** 업로드 완료 확인 후 DB 반영 (POST /images/confirm) */
export async function confirmUpload(body: ImageConfirmRequest) {
    const { data } = await api.post<ImageConfirmResponse>("/images/confirm", body);
    return data;
}
