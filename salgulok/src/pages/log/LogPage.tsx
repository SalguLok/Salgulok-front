import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";
import HeaderLeft from "../../components/common/HeaderLeft";
import { getPublicLogs } from "../../api/log/getPublicLogs";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";

const LogPage: React.FC = () => {
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    // presigned GET URL로 변환 헬퍼
    const toUrl = async (objectKey?: string | null): Promise<string> => {
        if (!objectKey) return "";
        try {
            // issueGetPresigned는 PresignedUrlResponse 즉, { items: PresignedUrlItem[] }을 반환
            const res = await issueGetPresigned(objectKey);
            // 단일 조회이므로 첫번째 아이템의 presignedUrl을 사용
            if (res.items && res.items.length > 0) {
                return res.items[0].presignedUrl;
            }
            return "";
        } catch {
            return "";
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1) 공개 살구록 배열 가져오기
                const logsRes = await getPublicLogs(); // <- 배열

                // 2) 각 항목의 대표이미지/작성자 프로필 presigned URL 발급
                const processed = await Promise.all(
                    logsRes.map(async (log) => {
                        const [imageUrl, writerProfileUrl] = await Promise.all([
                            toUrl(log.imgUrl),
                            toUrl(log.writerProfile),
                        ]);

                        const item: LogItem = {
                            id: log.logId,
                            title: log.title,
                            writer: log.writer,
                            image: imageUrl,            // 카드 썸네일
                            writerProfile: writerProfileUrl, // 작성자 아바타 (컴포넌트가 쓰면)
                            likes: log.likes,
                            isPublic: log.isPublic,
                            date: `${log.startDate} - ${log.endDate}`,
                            comments: 0, // 댓글 수는 아직 API 미연결이라 0으로
                            oneLine: log.oneReview, // CardListItem이 요약 텍스트를 받는다면
                        };

                        return item;
                    })
                );

                setLogs(processed);
            } catch (err) {
                console.error("공개 살구록 리스트 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location]);

    return (
        <Container>
            <HeaderLeft title="살구로그" />
            <ContentWrapper>
                {loading ? (
                    <div>불러오는 중...</div>
                ) : (
                    <CardContainer>
                        {/* LogCardList가 배열을 받아 렌더하는 컴포넌트라고 가정 */}
                        <LogCardList items={logs} />
                    </CardContainer>
                )}
            </ContentWrapper>
            <NavigationBar />
        </Container>
    );
};

export default LogPage;

// ===== styled =====
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 67px; /* NavigationBar height */
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 16px;
  align-items: center;
  width: 100%;
`;

const CardContainer = styled.div`
  display: flex;
  margin: 0 20px;
`;
