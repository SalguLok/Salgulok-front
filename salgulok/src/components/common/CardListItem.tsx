import styled from "styled-components";
import type { FC, MouseEvent } from "react";
import Heart from "../../assets/common/heart.svg?react";
import Comment from "../../assets/common/comment.svg?react";
import Profile from "../../assets/common/profile_default.svg?react";

export type LogItem = {
  id: string;
  image: string;
  writer: string;
  writerProfile?: string;
  title: string;
  date: string;
  likes: number;
  comments: number;
  liked?: boolean;
};

type Props = {
  items: LogItem[];
  onClick?: (id: string) => void;
  onToggleLike?: (id: string, e: MouseEvent) => void;
};

const LogCardList: FC<Props> = ({ items, onClick }) => {
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
                <ReactionText>{item.comments}</ReactionText>
              </ReactionWrapper>
            </ReactionContainer>
          </ImageContainer>

          <DetailContainer>
            <WriterContainer>
              {item.writerProfile ? (
                <WriterImg src={item.writerProfile} alt="" />
              ) : (
                <Profile aria-hidden />
              )}
              <Writer>{item.writer}</Writer>
            </WriterContainer>
            <Title>{item.title}</Title>
            <Date>{item.date}</Date>
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
  margin: 8px 4px 4px 4px;
`;
const WriterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
`;
const WriterImg = styled.img`
  width: 17px;
  height: 17px;
`;
const Writer = styled.span`
  font-size: 13px;
  font-weight: 400;
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
