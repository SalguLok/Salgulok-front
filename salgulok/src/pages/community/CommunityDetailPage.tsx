// pages/community/CommunityDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../../components/common/Header";
import CommentInputBar from "../../components/common/CommentInputBar"; // 댓글 입력창 컴포넌트
import { getPostById, deletePost, createComment, deleteComment, getCommentsByPostId } from "../../api/community/community";
import type { CommentResponse } from "../../api/community/community";
import DefaultProfileImage from "../../assets/common/my_gray.svg";
import { formatKst } from "../../utils/date";
import PresignedImage from "../../components/common/PresignedImage";
import NavigationBar from "../../components/common/NavigationBar";
import CommentItem from "./CommentItem";

const CommunityDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const numericPostId = Number(postId);
  
  // 현재 사용자 ID (실제로는 인증 상태에서 가져와야 함)
  const currentUserId = parseInt(localStorage.getItem("userId") || "0");

  // 1. 게시글 상세 정보 조회
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["communityPost", numericPostId],
    queryFn: () => getPostById(numericPostId),
    enabled: !!numericPostId, // postId가 유효할 때만 쿼리 실행
  });

  // 1.1. 댓글 목록 조회
  const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ["communityComments", numericPostId],
    queryFn: () => getCommentsByPostId(numericPostId),
    enabled: !!numericPostId,
  });

  // 2. 게시글 삭제 뮤테이션
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      navigate("/community");
    },
  });

  // 3. 댓글 생성 뮤테이션
  const createCommentMutation = useMutation({
    mutationFn: ({ content }: { content: string }) => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      }
      return createComment(numericPostId, { content, authorId: parseInt(userId) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityComments", numericPostId] });
    },
    onError: (error) => {
      console.error("댓글 생성 실패:", error);
      alert(error.message || "댓글 생성에 실패했습니다.");
    },
  });

  // 4. 댓글 삭제 뮤테이션 (작성자 검증 포함)
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => {
      console.log("[댓글삭제] mutate 호출", { postId: numericPostId, commentId });
      return deleteComment(numericPostId, commentId);
    },
    onSuccess: (_, commentId) => {
      console.log("[댓글삭제] 성공", { postId: numericPostId, commentId });
      alert("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["communityComments", numericPostId] });
    },
    onError: (error, commentId) => {
      // @ts-ignore
      const status = error?.response?.status;
      // @ts-ignore
      const data = error?.response?.data;
      console.error("[댓글삭제] 실패", { postId: numericPostId, commentId, status, data, error });
      alert(`댓글 삭제에 실패했습니다. ${status ? `(${status})` : ""}`);
    }
  });

  const handleDeletePost = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deletePostMutation.mutate(numericPostId);
    }
  };

  const handleCreateComment = (content: string) => {
    createCommentMutation.mutate({ content });
  };

  const handleDeleteComment = (commentId: number) => {
    console.log("[댓글삭제] 클릭", { commentId });
    const currentUserId = localStorage.getItem("userId");
    console.log("[댓글삭제] 현재 사용자", { currentUserId });
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const target = comments.find((c) => c.id === commentId);
    console.log("[댓글삭제] 타겟 댓글", target);
    if (!target) {
      alert("댓글을 찾을 수 없습니다.");
      return;
    }

    const isAuthor = target.authorId === parseInt(currentUserId);
    console.log("[댓글삭제] 본인 여부", { targetAuthorId: target.authorId, currentUserId: parseInt(currentUserId), isAuthor });
    if (!isAuthor) {
      alert("본인이 작성한 댓글만 삭제할 수 있습니다.");
      return;
    }

    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  if (isLoading) return <Layout><div>로딩 중...</div></Layout>;
  if (error || !post) return <Layout><div>게시글을 불러올 수 없습니다.</div></Layout>;

  return (
    <Layout>
      <Header title="커뮤니티" showBackButton={true} />
      <Wrap>
        {/* 게시글 */}
        <PostSection>
          <HeaderPost>
            {post.authorProfileImg ? (
              <AvatarPresigned objectKey={post.authorProfileImg} alt={post.username} />
            ) : (
              <Avatar src={DefaultProfileImage} alt={post.username} />
            )}
            <div>
              <User>{post.username}</User>
              <Meta>
                {formatKst(post.createdAt)} · {post.region}
              </Meta>
            </div>
            <Menu onClick={handleDeletePost}>⋮</Menu> {/* 메뉴 버튼에 삭제 기능 연결 */}
          </HeaderPost>
          <Body>{post.content}</Body>
          <Footer>
            {post.topic && <Badge>{post.topic}</Badge>}
          </Footer>
        </PostSection>

       

        {/* 댓글 */}
        <CommentTitle>댓글 {comments?.length ?? 0}</CommentTitle>
         {/* 댓글 입력 바 */}
         <CommentInputWrapper>
          <CommentInputBar 
            onSubmit={handleCreateComment} 
            disabled={createCommentMutation.isPending}
            buttonText={createCommentMutation.isPending ? "등록 중..." : "등록"}
          />
        </CommentInputWrapper>
        {isCommentsLoading ? (
          <div>댓글 로딩 중...</div>
        ) : (
          comments?.map((c: CommentResponse) => (
            <CommentItem 
              key={c.id}
              comment={c}
              onDelete={handleDeleteComment}
              canDelete={currentUserId === c.authorId}
            />
          ))
        )}
      </Wrap>
      <NavigationBar />
    </Layout>
  );
};

export default CommunityDetailPage;

const AvatarPresigned = styled(PresignedImage)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  background-color: var(--gray-100); /* 추가: 로딩 중 배경색 */
`;

// style
const Layout = styled.div`
  position: relative;
  background: var(--white);
  min-height: 100vh;
  margin: 0 auto;
  max-width: 375px;
  padding-bottom: 120px;
`;

const Wrap = styled.div`
  max-width: 375px;
  margin: 0 auto;
  padding: 16px 20px 100px;
`;

const PostSection = styled.div`
  border-bottom: 1px solid var(--gray-100);
  padding-top: 16px;
  padding-bottom: 16px;
  margin-bottom: 16px;
`;

const HeaderPost = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
`;

const User = styled.div`
  font-weight: 600;
  font-size: 14px;
  font-family: "Pretendard", sans-serif;
`;

const Meta = styled.div`
  font-size: 12px;
  color: var(--gray-300);
  margin-top: 2px;
  font-family: "Pretendard", sans-serif;
`;

const Body = styled.p`
  font-size: 13px;
  line-height: 1.6;
  margin-top: 12px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
`;

const CommentInputWrapper = styled.div`
  margin: 0px 0 16px;
`;

const CommentTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 16px 0 20px;
  font-family: "Pretendard", sans-serif;
`;

const Menu = styled.div`
  font-size: 18px;
  color: var(--gray-400);
  cursor: pointer;
  margin-left: auto;
`;


const Badge = styled.span`
  padding: 2px 11px;
  border-radius: 25px;
  border: 0.5px solid var(--main-pri);
  color: var(--main-pri);
  font-size: 12px;
`;