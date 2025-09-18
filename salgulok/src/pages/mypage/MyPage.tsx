import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import ProfileInfoItem from "../../components/mypage/ProfileInfoItem";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";
import HeaderLeft from "../../components/common/HeaderLeft";
import { getMyLogs } from "../../api/log/getMyLog";
import Logout from "../../assets/mypage/logout.svg?react";
import { logout } from "../../api/auth/logout";
import { deleteMyLogs } from "../../api/log/getMyLog";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getMyInfo } from "../../api/user/getMyProfile";

const MyPage: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [delLogId, setDelLogId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, userInfo] = await Promise.all([
          getMyLogs(),
          getMyInfo(),
        ]);

        const processedLogs = logsRes.logs.map(
          (log) =>
            ({
              id: log.logId,
              image: log.imgUrl, // S3 Key 전달
              writer: log.writer,
              // 내 프로필 이미지 키 또는 다른 사람의 프로필 이미지 키 전달
              writerProfile:
                log.writer === userInfo.nickname
                  ? userInfo.profileImg
                  : log.writerProfile,
              title: log.title,
              isPublic: log.isPublic,
              date: `${log.startDate} - ${log.endDate}`,
              likes: 0,
              comments: 0,
            } as LogItem)
        );

        setLogs(processedLogs);
      } catch (err) {
        console.error("내 로그/유저 정보 불러오기 실패", err);
      }
    };

    fetchData();
  }, [location]);

  //로그아웃 API 연결
  const readLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  //더보기 클릭
  const handleClickMore = (id: number) => {
    setDelLogId(id);
    setShowDeleteModal(true);
  };

  // 로그 삭제 API 연결
  const delMyLog = async () => {
    if (!delLogId || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteMyLogs(Number(delLogId));
      setLogs((prev) => prev.filter((l) => l.id !== delLogId));
    } catch (err) {
      console.error("삭제 실패");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDelLogId(null);
    }
  };
  return (
    <Container>
      <HeaderLeft
        title="마이페이지"
        right={
          <IconButton
            aria-label="로그아웃"
            onClick={() => setShowLogoutModal(true)}
            disabled={isLoggingOut}
            title="로그아웃"
          >
            <Logout />
          </IconButton>
        }
      />

      <ContentWrapper>
        <ProfileInfoItem key={location.key} />
        <CardContainer>
          <LogCardList
            items={logs}
            onClick={(id) => console.log("open", id)}
            onToggleLike={(id) => console.log("like", id)}
            onClickMore={handleClickMore}
          />
        </CardContainer>
      </ContentWrapper>

      {/*로그아웃 모달*/}
      <ConfirmModal
        open={showLogoutModal}
        message="정말로 로그아웃하시겠습니까?"
        confirmText="예"
        cancelText="아니오"
        loading={isLoggingOut}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          await readLogout();
          setShowLogoutModal(false);
        }}
      />

      {/*삭제 모달*/}
      <ConfirmModal
        open={showDeleteModal}
        message="해당 로그를 정말로 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        loading={isDeleting}
        onCancel={() => {
          setShowDeleteModal(false);
          setDelLogId(null);
        }}
        onConfirm={delMyLog}
      />

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

const CardContainer = styled.div`
  display: flex;
  margin: 0px 20px;
`;
const IconButton = styled.button`
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  & > svg {
    width: 20px;
    height: 20px;
    display: block;
  }
`;
