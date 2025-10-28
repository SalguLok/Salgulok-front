import styled from "styled-components";
import type { FC, MouseEvent } from "react";
import Star from "../../assets/common/star.svg?react";
//import Heart from "../../assets/common/heart.svg?react";
import Log from "../../assets/common/log.svg?react";

export type PlaceItem = {
  id: string;
  image?: string;
  placeName: string;
  mapx?: string;
  mapy?: string;
  starCount: number;
  logCount: number;
  comments: number;
  star: number;
};

type Props = {
  items: PlaceItem[];
  onClick?: (id: string) => void;
  onToggleLike?: (id: string, e: MouseEvent) => void;
};

const PlaceCardSlider: FC<Props> = ({ items, onClick }) => {
  return (
    <Layout>
      {items.map((item, i) => (
        <Card
          key={item.id ?? `${item.placeName ?? "place"}-${i}`}
          onClick={() => onClick?.(item.id)}
        >
          <ImageContainer>
            {item.image ? (
              <CoverImg src={item.image} alt="" loading="lazy" />
            ) : (
              <Placeholder>NO IMG</Placeholder>
            )}
          </ImageContainer>

          <DetailContainer>
            <Title>{item.placeName}</Title>
            <ReactionContainer>
              <ReactionWrapper>
                <Star />
                <ReactionText>
                  {Number((item.star ?? 0).toFixed(1))}
                </ReactionText>
              </ReactionWrapper>
              <ReactionWrapper>
                <Log />
                <ReactionText>{item.logCount}</ReactionText>
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

  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  touch-action: pan-x;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  padding-left: 20px;
  padding-right: 20px;

  scroll-padding-left: 20px;
  scroll-padding-right: 20px;

  cursor: pointer;
`;

const Card = styled.div`
  border-radius: 10px;
  margin-bottom: 5px;

  flex: 0 0 10px;
  scroll-snap-align: start;

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
  gap: 6px;
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
const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 10px;
  color: var(--gray-500);
`;
