import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import ProfileInfoItem from "../../components/mypage/ProfileInfoItem";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";
import HeaderLeft from "../../components/common/HeaderLeft";
import { getOthersLogs } from "../../api/log/getLogs";
import { getOtherProfile } from "../../api/user/getOtherProfile";
import Paging from "../../components/log/Paging";
import profile from "../../assets/common/profile_default.svg?url";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";
import { getLogComments } from "../../api/log/logComment";

const MyPage: React.FC = () => {
  const { nickname } = useParams<{ nickname: string }>();

  const [logs, setLogs] = useState<LogItem[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);  // api로 가져온 회원정보
  const [profileImgUrl, setProfileImgUrl] = useState<string>(profile);  // 회원프로필 img

  const location = useLocation();

  // 페이지네이션
  const [page, setPage] = useState(1); // UI 1-based
  const [totalPages, setTotalPages] = useState(1);
  const [length, setLength] = useState(1);

  // 페이지 기반 로그 가져오기
  const fetchLogs = async (pageNum: number) => {
    try {
      if (!nickname) {
        console.error("닉네임이 없습니다.");
        return;
      }

      // 회원정보 및 로그 들고오기
      const [logsRes, user] = await Promise.all([
        getOthersLogs(pageNum - 1, nickname),
        getOtherProfile(nickname!),
      ]);

      setUserInfo(user);

      //프로필 이미지 불러오기
      if (user.profileImg) {
        try {
          const presignedData = await issueGetPresigned(user.profileImg);
          if (presignedData.items.length > 0) {
            setProfileImgUrl(presignedData.items[0].presignedUrl);
          }
        } catch (e) {
          console.error("Failed to get presigned URL", e);
          setProfileImgUrl(profile);
        }
      }

      const processedLogs = logsRes.logs.map(
        (log) =>
          ({
            id: log.logId,
            image: log.imgUrl,
            writer: log.writer,
            writerProfile:
              log.writer === user.nickname
                ? user.profileImg
                : log.writerProfile,
            title: log.title,
            isPublic: log.isPublic,
            date: `${log.startDate} - ${log.endDate}`,
            likes: log.likes,
            comments: 0,
          } as LogItem)
      );

      // 댓글 수 추가 조회
      const logsWithComments = await Promise.all(
        processedLogs.map(async (log) => {
          try {
            const commentsData = await getLogComments(log.id, {
              page: 0,
              size: 1,
              sort: "createdAt",
            });
            return { ...log, comments: commentsData.totalElements };
          } catch (error) {
            console.error(`로그 ${log.id} 댓글 수 조회 실패:`, error);
            return { ...log, comments: 0 };
          }
        })
      );      

      setLogs(logsWithComments);

      // 페이징 정보 업데이트
      setTotalPages(logsRes.totalPages);
      setPage(logsRes.currentPage + 1); // 0-based -> 1-based
      setLength(logsRes.length);
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [location, page]);

  return (
    <Container>
      <HeaderLeft
        title="사용자 프로필"
      />

      <ContentWrapper>
        {userInfo && (
          <ProfileInfoItem
            nickname={userInfo.nickname}
            intro={userInfo.intro}
            profileImgUrl={profileImgUrl}
            isMine={false}
          />
        )}
        <HLine />
        
        <CardContainer>
          <LogCardList
            items={logs}
            onClick={(_id) => {}}
            onToggleLike={(_id) => {}}
          />
        </CardContainer>
      </ContentWrapper>

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          {logs.length >= 4 ? (
            <Paging
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(p) => setPage(p)}
              listLength={length}
            />
          ) : (
            // 리스트 적을 때 하단에 고정
            <FixedPagingWrapper>
              <Paging
                totalPages={totalPages}
                currentPage={page}
                onPageChange={(p) => setPage(p)}
                listLength={length}
              />
            </FixedPagingWrapper>
          )}
        </>
      )}

      <NavigationBar />
    </Container>
  );
};

export default MyPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 70px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 16px;
  align-items: center;
  width: 100%;
`;

const HLine = styled.div`
  width: 375px;
  border: 1px solid #f1f1f1;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: 2px 0px 7px 0px;
`;

const FixedPagingWrapper = styled.div`
  position: fixed;
  bottom: 67px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const CardContainer = styled.div`
  display: flex;
  margin: 0px 20px;
`;
