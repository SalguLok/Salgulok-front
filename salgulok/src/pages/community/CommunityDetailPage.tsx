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
import NavigationBar from "../../components/common/NavigationBar";

const CommunityDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const numericPostId = Number(postId);

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
    mutationFn: ({ content }: { content: string }) => createComment(numericPostId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityComments", numericPostId] });
    },
  });

  // 4. 댓글 삭제 뮤테이션
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(numericPostId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityComments", numericPostId] });
    },
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
            <Avatar src={post.authorProfileImg || DefaultProfileImage} alt={post.username} />
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

        {/* 댓글 입력 바 */}
        <CommentInputWrapper>
          <CommentInputBar onSubmit={handleCreateComment} />
        </CommentInputWrapper>

        {/* 댓글 */}
        <CommentTitle>댓글 {comments?.length ?? 0}</CommentTitle>
        {isCommentsLoading ? (
          <div>댓글 로딩 중...</div>
        ) : (
          comments?.map((c: CommentResponse) => (
            <CommentBox key={c.id}>
              <HeaderPost>
                <Avatar src={DefaultProfileImage} alt={c.username} />
                <div>
                  <User>{c.username}</User>
                </div>
                <Menu onClick={() => handleDeleteComment(c.id)}>⋮</Menu> {/* 댓글 삭제 기능 연결 */}
              </HeaderPost>
              <CommentBody>{c.content}</CommentBody>
            </CommentBox>
          ))
        )}
      </Wrap>
      <NavigationBar />
    </Layout>
  );
};

export default CommunityDetailPage;

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
`;

const Meta = styled.div`
  font-size: 12px;
  color: var(--gray-300);
  margin-top: 2px;
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
  margin: 24px 0 16px;
`;

const CommentTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  margin: 16px 0 8px;
`;

const CommentBox = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid var(--gray-100);
`;

const CommentBody = styled.p`
  font-size: 13px;
  margin-left: 48px; /* 아바타 오른쪽 정렬 유지 */
  margin-top: 6px;
`;

const Menu = styled.div`
  font-size: 18px;
  color: var(--gray-400);
  cursor: pointer;
  margin-left: auto; /* 아바타+텍스트 오른쪽 끝으로 밀기 */
`;

const Badge = styled.span`
  padding: 2px 11px;
  border-radius: 25px;
  border: 0.5px solid var(--main-pri);
  color: var(--main-pri);
  font-size: 12px;
`;
