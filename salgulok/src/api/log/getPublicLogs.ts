import api from "../api";

export interface LogResponse {
    logId: number;
    writer: string;        // 작성자 이름
    writerProfile: string; // 작성자 프로필 이미지 URL
    title: string;
    startDate: string;
    endDate: string;
    isPublic: boolean;
    regionId: number;
    imgUrl: string;
    oneReview: string;
    likes: number;         // 좋아요 수
    isLiked?: boolean;     // 지역별 API는 항상 false로 내려올 수 있음
}

export const getPublicLogs = async (): Promise<LogResponse[]> => {
    try {
        const { data } = await api.get<LogResponse[]>("/logs/public");
        return data;
    } catch (error) {
        console.error("공개 살구록 리스트 불러오기 실패:", error);
        throw error;
    }
};
