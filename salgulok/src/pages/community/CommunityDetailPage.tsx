// pages/community/CommunityDetailPage.tsx
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PostCard from "./PostCard";
import CommentItem from "./CommentItem";
import type { Post, Comment } from "../../types/post";

const CommunityDetailPage = () => {
  const { postId } = useParams(); // 필요하면 이 id로 API 호출
  // 데모: 서버 붙기 전이면 dummy로 가져오기

  return (
    <Wrap>
      {/* 공통 Header 재사용 */}
      <h1>커뮤니티</h1>
      <Title>게시글 #{postId}</Title>
      <Meta>2025.08.10 · 월버</Meta>
      <Body>
        본문 내용이 들어갑니다. 서버 연결 후 postId로 상세를 조회하세요.
      </Body>
      {/* 댓글 목록 섹션 등 */}
    </Wrap>
  );
};

export default CommunityDetailPage;

const Wrap = styled.div`max-width:375px;margin:0 auto;padding:16px 20px 100px;`;
const Title = styled.h2`font-size:18px;margin:12px 0;`;
const Meta = styled.div`font-size:12px;color:var(--gray-300);`;
const Body = styled.p`font-size:14px;line-height:1.6;margin-top:12px;`;
