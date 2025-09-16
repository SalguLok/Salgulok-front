import api from "../api";

/** 단일 이미지 삭제 (DELETE /images/{imageId}) */
export async function deleteImage(imageId: number) {
    await api.delete(`/images/${imageId}`);
}
