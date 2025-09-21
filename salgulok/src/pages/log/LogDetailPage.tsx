// pages/log/LogDetailPage.tsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import Header from "../../components/common/Header";
import { getLogDetail } from "../../api/log/getLogDetail";
import PresignedImage from "../../components/common/PresignedImage";
import NavigationBar from "../../components/common/NavigationBar";
import LogCommentSection from "../../components/log/LogCommentSection";

const LogDetailPage = () => {
  const { logId } = useParams<{ logId: string }>();
  const numericLogId = Number(logId);
  const [commentCount, setCommentCount] = useState(0);

  // 로그 상세 정보 조회
  const { data: logDetail, isLoading, error } = useQuery({
    queryKey: ["logDetail", numericLogId],
    queryFn: () => getLogDetail(numericLogId),
    enabled: !!numericLogId, // logId가 유효할 때만 쿼리 실행
  });

  // 현재 사용자 ID (실제로는 인증 상태에서 가져와야 함)
  const currentUserId = parseInt(localStorage.getItem("userId") || "0");

  // 댓글 수 변경 핸들러
  const handleCommentCountChange = (count: number) => {
    setCommentCount(count);
  };

  if (isLoading) {
    return (
      <Container>
        <Header title="살구로그" showBackButton={true} />
        <LoadingContainer>로딩 중...</LoadingContainer>
        <NavigationBar />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header title="살구로그" showBackButton={true} />
        <ErrorContainer>로그를 불러오는데 실패했습니다.</ErrorContainer>
        <NavigationBar />
      </Container>
    );
  }

  if (!logDetail) {
    return (
      <Container>
        <Header title="살구로그" showBackButton={true} />
        <ErrorContainer>로그를 찾을 수 없습니다.</ErrorContainer>
        <NavigationBar />
      </Container>
    );
  }

  const { title, oneReview, startDate, endDate, imgUrl, isPublic } = logDetail;

  return (
    <Container>
      <Header title="살구로그" showBackButton={true} />
      
      <Content>
        {/* 로그 상세 정보 */}
        <LogInfoSection>
          <LogTitle>{title}</LogTitle>
          <LogPeriod>
            {formatDot(startDate)} ~ {formatDot(endDate)}
          </LogPeriod>
          {imgUrl && (
            <LogImage>
              <PresignedImage src={imgUrl} alt={title} />
            </LogImage>
          )}
          {oneReview && (
            <LogReview>{oneReview}</LogReview>
          )}
          <LogVisibility>
            {isPublic ? "공개" : "비공개"}
          </LogVisibility>
        </LogInfoSection>

        {/* 댓글 섹션 */}
        <LogCommentSection 
          logId={numericLogId} 
          currentUserId={currentUserId}
          onCommentCountChange={handleCommentCountChange}
        />
      </Content>

      <NavigationBar />
    </Container>
  );
};

export default LogDetailPage;

// YYYY-MM-DD -> YYYY.MM.DD
function formatDot(s: string) {
  return s.replace(/-/g, ".");
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 67px; /* NavigationBar height */
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #e74c3c;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const LogInfoSection = styled.div`
  margin-bottom: 30px;
`;

const LogTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin: 0 0 8px 0;
`;

const LogPeriod = styled.div`
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
`;

const LogImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LogReview = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 12px;
`;

const LogVisibility = styled.div`
  font-size: 12px;
  color: #666;
  padding: 4px 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  display: inline-block;
`;
