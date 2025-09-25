import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileInfoItem from "../../components/mypage/ProfileInfoItem";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";
import HeaderLeft from "../../components/common/HeaderLeft";
import { getMyLogs } from "../../api/log/getLogs";
// import Logout from "../../assets/mypage/logout.svg?react";
import { logout } from "../../api/auth/logout";
import { deleteMyLogs } from "../../api/log/getLogs";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getMyInfo } from "../../api/user/getMyProfile";
import Pagination from "../../components/common/Pagination";
import profile from "../../assets/common/profile_default.svg?url";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";
import { getLogComments } from "../../api/log/logComment";

const MyPage: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null); // api로 가져온 회원정보
  const [profileImgUrl, setProfileImgUrl] = useState<string>(profile); // 회원프로필 img

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [delLogId, setDelLogId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // 페이지네이션
  const [page, setPage] = useState(1); // UI 1-based
  const [totalPages, setTotalPages] = useState(1);

  // 페이지 기반 로그 가져오기
  const fetchLogs = async (pageNum: number) => {
    try {
      // pageNum: 1-based, API에는 0-based 전달
      const [logsRes, user] = await Promise.all([
        getMyLogs(pageNum - 1),
        getMyInfo(),
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
    } catch (err) {
      console.error("내 로그/유저 정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [location, page]);

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
        // right={
        //   <IconButton
        //     aria-label="로그아웃"
        //     onClick={() => setShowLogoutModal(true)}
        //     disabled={isLoggingOut}
        //     title="로그아웃"
        //   >
        //     <Logout />
        //   </IconButton>
        // }
      />

      <ContentWrapper>
        {userInfo && (
          <ProfileInfoItem
            nickname={userInfo.nickname}
            intro={userInfo.intro}
            profileImgUrl={profileImgUrl}
            isMine={true}
          />
        )}
        <ButtonContainer>
          <ProfileEditButton
            type="button"
            onClick={() => navigate("/mypage/edit")}
            aria-label="프로필 수정"
            title="프로필 수정"
          >
            <Text>프로필 수정</Text>
          </ProfileEditButton>
          <LogoutButton
            type="button"
            onClick={() => setShowLogoutModal(true)}
            disabled={isLoggingOut}
            aria-label="로그아웃"
            title="로그아웃"
          >
            <Text>로그아웃</Text>
          </LogoutButton>
        </ButtonContainer>
        <HLine />
        <CardContainer>
          <LogCardList
            items={logs}
            onClick={(_id) => {}}
            onToggleLike={(_id) => {}}
            onClickMore={handleClickMore}
          />
        </CardContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
          />
        )}
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

const HLine = styled.div`
  width: 375px;
  border: 1px solid #f1f1f1;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: 2px 0px 7px 0px;
`;

const CardContainer = styled.div`
  display: flex;
  margin: 0px 20px;
`;
// const IconButton = styled.button`
//   width: 28px;
//   height: 28px;
//   border: 0;
//   background: transparent;
//   display: grid;
//   place-items: center;
//   cursor: pointer;

//   &:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }

//   & > svg {
//     width: 20px;
//     height: 20px;
//     display: block;
//   }
// `;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ProfileEditButton = styled.button`
  width: 215px;
  height: 28px;
  border-radius: 8px;
  background-color: #fbe1d2ff;
  border: none;
`;
const LogoutButton = styled.button`
  width: 110px;
  height: 28px;
  border-radius: 8px;
  background-color: #ffece0ff;
  border: none;
`;

const Text = styled.text`
  font-size: 12px;
  font-weight: 500;
`;
