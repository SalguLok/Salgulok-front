import api from "../api";

export interface UpdateProfileImageRequest {
    profileImg: string; // confirm 이후 받은 최종 URL
}

export async function updateProfileImage(body: UpdateProfileImageRequest) {
    try {
        const { data } = await api.put("/users/me", body);
        // ⚠️ 여기는 백엔드 UserController 실제 엔드포인트에 맞게 수정해야 해
        return data;
    } catch (error) {
        console.error("프로필 이미지 업데이트 실패", error);
        throw error;
    }
}
