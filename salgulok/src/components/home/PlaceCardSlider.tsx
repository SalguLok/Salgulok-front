import styled from "styled-components";
import type { FC, MouseEvent } from "react";
import Heart from "../../assets/common/heart.svg?react";
import Comment from "../../assets/common/comment.svg?react";

export type PlaceItem = {
  id: string;
  image: string;
  name: string;
  likes: number;
  comments: number;
  liked?: boolean;
};

type Props = {
  items: PlaceItem[];
  onClick?: (id: string) => void;
  onToggleLike?: (id: string, e: MouseEvent) => void;
};

const PlaceCardSlider: FC<Props> = ({ items, onClick }) => {
  return (
    <Layout>
      {items.map((item) => (
        <Card key={item.id} onClick={() => onClick?.(item.id)}>
          <ImageContainer>
            <CoverImg src={item.image} alt="" loading="lazy" />
          </ImageContainer>

          <DetailContainer>
            <Title>{item.name}</Title>
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
          </DetailContainer>
        </Card>
      ))}
    </Layout>
  );
};

export default PlaceCardSlider;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;

  /* 가로 슬라이드 */
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  touch-action: pan-x;

  /* 스크롤바 숨김 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* 왼쪽 여백만, 오른쪽은 0 → 끝에 공백 없음 */
  padding-left: 20px;
  padding-right: 20px;

  /* 스냅 기준도 왼쪽만 */
  scroll-padding-left: 20px;
  scroll-padding-right: 20px;
`;

const Card = styled.div`
  border-radius: 10px;
  margin-bottom: 5px;

  /* 카드 폭 고정 + 스냅 포인트 */
  flex: 0 0 10px;
  scroll-snap-align: start;

  /* 혹시 전역/상위 스타일에서 margin-right가 들어온 경우 대비 */
  &:last-child {
    margin-right: 0;
  }
`;
const ImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
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
  display: flex;
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

const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 3px;
`;
