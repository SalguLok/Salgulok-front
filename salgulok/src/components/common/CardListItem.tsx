import styled from "styled-components";
import type { FC, MouseEvent } from "react";
import Heart from "../../assets/common/heart.svg?react";
import Comment from "../../assets/common/comment.svg?react";
import Profile from "../../assets/common/profile_default.svg?react";
import Lock from "../../assets/mypage/lock.svg?react";

export type LogItem = {
  id: number;
  image: string;
  writer: string;
  writerProfile?: string;
  isPublic?: boolean;
  title: string;
  date: string;
  likes: number;
  liked?: boolean;
};

type Props = {
  items: LogItem[];
  onClick?: (id: number) => void;
  onToggleLike?: (id: number, e: MouseEvent) => void;
  onClickMore?: (id: number, e: MouseEvent) => void;
};

const LogCardList: FC<Props> = ({ items, onClick, onClickMore }) => {
  return (
    <Layout>
      {items.map((item) => (
        <Card key={item.id} onClick={() => onClick?.(item.id)}>
          <ImageContainer>
            <CoverImg src={item.image} alt="" loading="lazy" />
            <ReactionContainer>
              <ReactionWrapper>
                <Heart />
                <ReactionText>{item.likes}</ReactionText>
              </ReactionWrapper>
              <ReactionWrapper>
                <Comment />
                <ReactionText></ReactionText>
              </ReactionWrapper>
            </ReactionContainer>
          </ImageContainer>

          <DetailContainer>
            <WriterContainer>
              <WriterWrapper>
                {item.writerProfile ? (
                  <WriterImg src={item.writerProfile} alt="" />
                ) : (
                  <Profile aria-hidden />
                )}
                <Writer>{item.writer}</Writer>
              </WriterWrapper>
              {onClickMore && (
                <MoreButton
                  aria-label="더보기"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickMore(item.id, e);
                  }}
                />
              )}
            </WriterContainer>
            <Title>{item.title}</Title>
            <Date>
              {item.date} {item.isPublic ? "" : <Lock />}
            </Date>
          </DetailContainer>
        </Card>
      ))}
    </Layout>
  );
};

export default LogCardList;

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const Card = styled.div`
  border-radius: 10px;
  margin-bottom: 5px;
`;
const ImageContainer = styled.div`
  position: relative;
  width: 159px;
  height: 150px;
  background-color: var(--gray-300);
  border-radius: 10px;
  overflow: hidden;
`;
const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ReactionContainer = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: flex;
  gap: 6px;
  background-color: var(--white);
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  padding: 5px 7px;
`;
const ReactionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;
const ReactionText = styled.div`
  font-size: 11px;
  font-weight: 400;
  line-height: 100%;
`;
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0px 0px 4px;
`;
const WriterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;
const WriterWrapper = styled.div`
  display: flex;
  gap: 5px;
`;
const WriterImg = styled.img`
  width: 17px;
  height: 17px;
`;
const Writer = styled.span`
  font-size: 13px;
  font-weight: 400;
`;
const MoreButton = styled.button`
  display: flex;
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  cursor: pointer;
  position: relative;
  border-radius: 50%;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 3px;
    height: 3px;
    background: #9aa0a6;
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 0 -6px 0 #9aa0a6, 0 6px 0 #9aa0a6;
  }
  &:active {
    background: rgba(0, 0, 0, 0.06);
  }
`;
const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 3px;
`;
const Date = styled.span`
  color: var(--gray-400);
  font-family: Pretendard;
  font-size: 11px;
`;
